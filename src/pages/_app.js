import "@/styles/styles.scss";
import { Container } from "react-bootstrap";
import { AuthProvider } from "../contexts/AuthContext";
import { SubscriptionProvider } from "../contexts/SubscriptionContext";
import PageTransition from "@/components/PageTransition";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Navigation />
      <Container className='main-container'>
        <SubscriptionProvider>
          <PageTransition>
            <Component {...pageProps} />
          </PageTransition>
        </SubscriptionProvider>
      </Container>
      <Footer />
    </AuthProvider>
  );
}
