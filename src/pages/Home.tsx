import { FormDataProvider } from '../context/ToyFormDataContext.tsx';
import HomePage from '../features/Home/HomePage';
const Home = () => {
  return (
    <FormDataProvider>
      <div className="container mx-auto p-8 bg-white rounded-md">
        <h1 className="text-2xl font-bold mb-4">Գլխավոր էջ</h1>
        <HomePage />
      </div>
    </FormDataProvider>
  );
};

export default Home;