import Header from "./Header";
import Footer from "./Footer";

export default function beforeAuthLayout(PageComponent) {
  const Wrapped = (props) => (
    <div className="min-h-screen flex flex-col justify-between">
      <Header />
      {/* 👇 add top padding so content doesn't hide behind header */}
      <main className="flex-1 pt-8">
        <PageComponent {...props} />
      </main>
      <Footer />
    </div>
  );

  return Wrapped;
}
