import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);

    useEffect(() => {

        const storedUser =
            localStorage.getItem("user");

        if (storedUser && storedUser !== "undefined") {

            try {

                setUser(JSON.parse(storedUser));

            } catch (error) {

                console.log(
                    "Invalid user data",
                    error
                );

                localStorage.removeItem("user");
            }
        }

    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () =>
    useContext(AuthContext);