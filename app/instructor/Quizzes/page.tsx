import { Home } from "./Home";

export default function Page() {
  // هنا ممكن تحط function بسيطة للـ setActive
  const setActive = (key: string) => {
    console.log("Switched to:", key);
  };

  return <Home setActive={setActive} />;
}
