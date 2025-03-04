import { FormDataProvider } from '../../context/ToyFormDataContext.tsx';
import CreateCategoriesForm from '../../features/Categories/CreateCategories';

const CreateCategoriesPage = () => {
  return (
    <FormDataProvider>
      <div className="container mx-auto p-8 bg-white rounded-md">
        <h1 className="text-2xl font-bold mb-4">Create a New Category</h1>
        <CreateCategoriesForm />
      </div>
    </FormDataProvider>
  );
};

export default CreateCategoriesPage;
