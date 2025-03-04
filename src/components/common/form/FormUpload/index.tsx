import { useEffect, useState } from 'react';
import { FormUploadProps } from '../types';
import { useFormContext } from '../../../../context/ToyFormDataContext.tsx';

const FormUpload = ({ defaultValueImage, name, isSlider, token }: FormUploadProps) => {
  const { data, setData } = useFormContext();
  const initialImages = Array.isArray(data?.images) ? data.images : [];
  const initialImage = data?.image || null;
  const initialFile = data?.[name] instanceof File ? data?.[name] : null;

  const [file, setFile] = useState<File | null>(initialFile);
  const [fileList, setFileList] = useState<(File | { id: number; url: string; name: string })[]>(initialImages || []);
  const [image, setImage] = useState<File | null>(initialImage || (initialImages.length > 0 ? initialImages[0] : null));
  const [editingFile, setEditingFile] = useState<{ id: number; file: File | null } | null>(null);
  const [loading, setLoading] = useState<boolean>(false); // Состояние загрузки
  const [loadingFileId, setLoadingFileId] = useState<number | null>(null);

  // Sync `defaultValueImage` with `fileList` and `data`
  useEffect(() => {
    if (!defaultValueImage || defaultValueImage.length === 0) return;

    setFileList((prev) =>
      prev.length === 0 ? defaultValueImage.map((item) => ({ id: item.id, url: item.url, name: item.name })) : prev
    );

    // Update `data` only if `image` is not already set
    if (!data?.image && defaultValueImage.length > 0) {
      setData((prev) => ({ ...prev, image: defaultValueImage[0] }));
    }
  }, [defaultValueImage, setData, data?.image]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles) return;

    if (name === 'image') {
      const selectedFile = selectedFiles[0];
      setFile(selectedFile);
      setImage(selectedFile);
      setData((prevData) => ({ ...prevData, [name]: selectedFile }));
    } else {
      const newFiles = Array.from(selectedFiles);
      setFileList((prevFileList) => {
        const updatedFileList = [...prevFileList, ...newFiles];
        setData((prevData) => ({
          ...prevData,
          images: updatedFileList,
          image: updatedFileList[0],
        }));
        return updatedFileList;
      });
      setImage((prevImage) => (prevImage ? prevImage : newFiles[0]));
    }
  };

  const removeFile = (index: number, id?: number) => {
    if (isSlider && id) {
      handleDeleteImage(id, index);
    } else {
      setFileList((prevFileList) => {
        const updatedFileList = prevFileList.filter((_, i) => i !== index);
        setData((prevData) => ({
          ...prevData,
          images: updatedFileList,
          image: updatedFileList.length > 0 ? updatedFileList[0] : null,
        }));
        setImage(updatedFileList.length > 0 ? updatedFileList[0] : null);
        return updatedFileList;
      });
    }
  };


  const handleEditImage = async (id: number, file: File | null) => {
    if (!file) return;

    setLoadingFileId(id); // Устанавливаем состояние загрузки для конкретного файла

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch(`https://api.mytoy.am/admin/home/slider/update/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to update image');
      }

      setFileList((prevList) =>
        prevList.map((item) =>
          item instanceof File ? item : item.id === id ? { ...item, url: URL.createObjectURL(file) } : item
        )
      );

      setEditingFile(null);
    } catch (error) {
      console.error('Error updating image:', error);
    } finally {
      setLoadingFileId(null); // Сбрасываем состояние загрузки
    }
  };

  const handleDeleteImage = async (id: number, index: number) => {
    setLoadingFileId(id); // Устанавливаем состояние загрузки для конкретного файла

    try {
      const response = await fetch(`https://api.mytoy.am/admin/home/slider/delete/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error('Failed to delete image');
      }

      setFileList((prevFileList) => prevFileList.filter((_, i) => i !== index));
    } catch (error) {
      console.error('Error deleting image:', error);
    } finally {
      setLoadingFileId(null); // Сбрасываем состояние загрузки
    }
  };


  const startEditing = (id: number) => {
    const fileToEdit = fileList.find((item) => item.id === id);
    if (fileToEdit && !(fileToEdit instanceof File)) {
      setEditingFile({ id, file: null });
    }
  };

  const cancelEditing = () => {
    setEditingFile(null);
  };

  return (
    <div className="relative mb-5.5 block w-full rounded border border-dashed border-primary bg-gray py-4 px-4">
      <input
        type="file"
        id="file-upload"
        accept="image/*"
        multiple={name !== 'image'}
        className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
        onChange={handleFileChange}
      />
      <label htmlFor="file-upload" className="flex flex-col items-center justify-center space-y-3 cursor-pointer">
        <p><span className="text-primary">Click to upload</span> or drag and drop</p>
      </label>

      <div className="flex flex-wrap gap-2 justify-center relative z-20">
        {name === "image" && file ? (
          <div className="w-fit flex flex-col items-center">
            <img src={URL.createObjectURL(file)} alt={file.name} className="w-20 h-20 object-cover mx-auto" />
            <button type="button" className="mt-2 text-red-600 hover:underline block w-full text-center" onClick={() => removeFile(0)}>
              {loading ? "Loading..." : "Remove"}
            </button>
          </div>
        ) : (
          fileList.map((file, index) => (
            <div key={index} className="w-fit flex flex-col items-center">
              <img
                src={
                  editingFile?.id === file.id && editingFile?.file
                    ? URL.createObjectURL(editingFile.file)
                    : file instanceof File
                      ? URL.createObjectURL(file)
                      : file.url
                }
                alt={file.name}
                className="w-20 h-20 object-cover mx-auto"
              />
              <button
                type="button"
                className="mt-2 text-red-600 hover:underline block w-full text-center"
                onClick={() => removeFile(index, file.id)}
                disabled={loadingFileId === file.id}
              >
                {loadingFileId === file?.id ? "Loading..." : "Remove"}
              </button>

              {isSlider && !(file instanceof File) && (
                <div className="flex flex-col items-center">
                  {editingFile?.id === file.id ? (
                    <div className="flex flex-col gap-1 w-full">
                      <input
                        type="file"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setEditingFile({ id: file.id, file: e.target.files[0] });
                          }
                        }}
                        className="block w-full text-sm"
                      />
                      <button
                        type="button"
                        className="text-blue-600 hover:underline block w-full text-center"
                        onClick={() => editingFile?.file && handleEditImage(file.id, editingFile.file)}
                        disabled={loadingFileId === file.id}
                      >
                        {loadingFileId === file.id ? "Loading..." : "Պահպանել"}
                      </button>
                      <button
                        type="button"
                        className="text-gray-600 hover:underline block w-full text-center"
                        onClick={cancelEditing}
                      >
                        Չեղարկել
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="mt-2 text-blue-600 hover:underline block w-full text-center"
                      onClick={() => startEditing(file.id)}
                    >
                      Փոփոխել
                    </button>
                  )}
                </div>
              )}

            </div>
          ))
        )}
      </div>
    </div>
  );

};

export default FormUpload;