import { FormDataProvider } from '../../context/ToyFormDataContext.tsx';
import CreateCategoriesForm from '../../features/Categories/CreateCategories';

const CategoriesSingle = () => {
  return (
    <FormDataProvider>
      <div className="container mx-auto p-8 bg-white rounded-md">
        <h1 className="text-2xl font-bold mb-4">Category</h1>
        <CreateCategoriesForm />
      </div>
    </FormDataProvider>
  );
};

export default CategoriesSingle;
