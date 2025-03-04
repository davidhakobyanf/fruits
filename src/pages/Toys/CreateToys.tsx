import { FormDataProvider } from '../../context/ToyFormDataContext.tsx';
import CreateToysForm from '../../features/Toys/CreateToys';

const CreateToyPage = () => {
  return (
    <FormDataProvider>
      <div className="container mx-auto p-8 bg-white rounded-md">
        <h1 className="text-2xl font-bold mb-4">Create a New Toy</h1>
        <CreateToysForm />
      </div>
    </FormDataProvider>
  );
};

export default CreateToyPage;
