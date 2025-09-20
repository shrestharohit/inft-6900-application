import Header from "./Header";
import Footer from "./Footer";

export default function beforeAuthLayout(PageComponent) {
  const Wrapped = (props) => (
    <div className="min-h-screen flex flex-col justify-between">
      <Header />
      <PageComponent {...props} />
      <Footer />
    </div>
  );

  return Wrapped;
}
