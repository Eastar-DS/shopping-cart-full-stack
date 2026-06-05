// App.tsx
import { Routes, Route } from "react-router-dom";
import { GlobalStyles } from "./shared/styles/GlobalStyles";
import { Header } from "./shared/components/Header";
import { CartPage } from "./features/cart/pages/CartPage";
import { CheckoutPage } from "./features/checkout/pages/CheckoutPage";

function App() {
  return (
    <>
      <GlobalStyles />
      <Header />
      <Routes>
        <Route path="/" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
      </Routes>
    </>
  );
}

export default App;
