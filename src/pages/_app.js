import "@/styles/styles.scss";
import { Container } from "react-bootstrap";
import { AuthProvider } from "../contexts/AuthContext";
import { SubscriptionProvider } from "../contexts/SubscriptionContext";
import Navigation from "@/components/Navigation";

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Navigation />
      <Container>
        <SubscriptionProvider>
          <Component {...pageProps} />
        </SubscriptionProvider>
      </Container>
    </AuthProvider>
  );
}
