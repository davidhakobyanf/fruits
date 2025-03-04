import { FormDataProvider } from '../../context/ToyFormDataContext.tsx';
import EditCategories from '../../features/Categories/EditCategories';

const CategoriesSingleEdit = () => {
  return (
    <FormDataProvider>
      <div className="container mx-auto p-8 bg-white rounded-md">
        <h1 className="text-2xl font-bold mb-4">Category</h1>
        <EditCategories />
      </div>
    </FormDataProvider>
  );
};

export default CategoriesSingleEdit;
