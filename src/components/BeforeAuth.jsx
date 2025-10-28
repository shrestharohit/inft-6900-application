import Header from "./Header";
import Footer from "./Footer";

export default function beforeAuthLayout(PageComponent) {
  const Wrapped = (props) => (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* ✅ Make header fixed */}
      <div className="fixed top-0 left-0 w-full z-50">
        <Header />
      </div>

      {/* ✅ Add top padding equal to header height to prevent overlap */}
      <main className="flex-1 overflow-auto pt-[100px] px-4 md:px-8">
        <PageComponent {...props} />
      </main>

      <Footer />
    </div>
  );

  return Wrapped;
}
