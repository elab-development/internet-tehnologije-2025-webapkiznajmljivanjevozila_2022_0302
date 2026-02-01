import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

axios.defaults.baseURL =
  import.meta.env.VITE_BASE_URL || "http://localhost:3000";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();

  // (zadržano) simbol valute ako želiš negde da koristiš
  const currency = import.meta.env.VITE_CURRENCY || "€";

  // ✅ Bazna valuta u kojoj su cene u bazi (promeni ako nije EUR)
  const BASE_PRICE_CURRENCY = "EUR";

  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");

  const [cars, setCars] = useState([]);

  // ✅ RESTCountries data (VIDLJIVO)
  const [countries, setCountries] = useState([]);
  const [countriesLoading, setCountriesLoading] = useState(false);

  // ✅ Valute (izvučene iz RESTCountries)
  const [currencies, setCurrencies] = useState(["EUR", "USD", "RSD"]); // fallback
  const [selectedCurrency, setSelectedCurrency] = useState("EUR");
  const [currenciesLoading, setCurrenciesLoading] = useState(false);

  // ✅ Cache za konverziju (da ne spamuje API)
  const conversionCacheRef = useRef(new Map());

  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/user/data");
      if (data.success) {
        setUser(data.user);
        setIsOwner(data.user.role === "owner");
      }
    } catch (error) {
      // ne mora toast na svako refresh
    }
  };

  const fetchCars = async () => {
    try {
      const { data } = await axios.get("/api/user/cars");
      if (data.success) setCars(data.cars);
      else toast.error(data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  // ✅ RESTCountries → countries + currencies
  const fetchCountriesAndCurrencies = async () => {
    setCountriesLoading(true);
    setCurrenciesLoading(true);

    try {
      const { data } = await axios.get("/api/integrations/countries");
      if (!data?.success) {
        toast.error(data?.message || "Failed to fetch countries");
        return;
      }

      const list = Array.isArray(data.countries) ? data.countries : [];
      setCountries(list);

      const set = new Set();
      list.forEach((c) => {
        (c.currencies || []).forEach((code) => {
          if (
            typeof code === "string" &&
            code.length >= 3 &&
            code.length <= 4
          ) {
            set.add(code.toUpperCase());
          }
        });
      });

      const currencyList = Array.from(set);
      currencyList.sort((a, b) => a.localeCompare(b));

      if (currencyList.length > 0) {
        setCurrencies(currencyList);
        if (!currencyList.includes(selectedCurrency))
          setSelectedCurrency("EUR");
      } else {
        setCurrencies(["EUR", "USD", "RSD"]);
      }
    } catch (error) {
      setCountries([]);
      setCurrencies(["EUR", "USD", "RSD"]);
    } finally {
      setCountriesLoading(false);
      setCurrenciesLoading(false);
    }
  };

  // ✅ ExchangeRate → konverzija preko backend-a
  const convertAmount = async (
    amount,
    from = BASE_PRICE_CURRENCY,
    to = selectedCurrency,
  ) => {
    const a = Number(amount ?? 0);
    if (Number.isNaN(a)) return 0;

    if (!from || !to || from === to) return a;

    const key = `${a}|${from}|${to}`;
    const cache = conversionCacheRef.current;

    if (cache.has(key)) return cache.get(key);

    try {
      const { data } = await axios.get("/api/integrations/currency/convert", {
        params: { amount: a, from, to },
      });

      if (data?.success) {
        cache.set(key, data.converted);
        return data.converted;
      }
      return a;
    } catch {
      return a;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setIsOwner(false);
    delete axios.defaults.headers.common["Authorization"];
    toast.success("You have been logged out");
    navigate("/");
  };

  // init
  useEffect(() => {
    fetchCars();
    fetchCountriesAndCurrencies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // auth header + fetch user
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      fetchUser();
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const value = useMemo(
    () => ({
      navigate,
      axios,
      currency,
      BASE_PRICE_CURRENCY,

      token,
      setToken,
      user,
      setUser,
      isOwner,
      setIsOwner,
      showLogin,
      setShowLogin,
      logout,

      cars,
      setCars,
      fetchCars,

      pickupDate,
      setPickupDate,
      returnDate,
      setReturnDate,

      // ✅ RESTCountries
      countries,
      countriesLoading,

      // ✅ currencies
      currencies,
      currenciesLoading,
      selectedCurrency,
      setSelectedCurrency,

      // ✅ ExchangeRate
      convertAmount,
    }),
    [
      navigate,
      currency,
      token,
      user,
      isOwner,
      showLogin,
      cars,
      pickupDate,
      returnDate,
      countries,
      countriesLoading,
      currencies,
      currenciesLoading,
      selectedCurrency,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
