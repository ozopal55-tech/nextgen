import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Home from "./pages/Home.jsx";
import { DemoPage, InquiryPage, TutorPage } from "./pages/FormPages.jsx";
import Legal, { NotFound } from "./pages/Legal.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/book-demo" element={<DemoPage />} />
          <Route path="/inquiry" element={<InquiryPage />} />
          <Route path="/become-a-tutor" element={<TutorPage />} />
          <Route path="/privacy" element={<Legal page="privacy" />} />
          <Route path="/terms" element={<Legal page="terms" />} />
          <Route path="/refund" element={<Legal page="refund" />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
