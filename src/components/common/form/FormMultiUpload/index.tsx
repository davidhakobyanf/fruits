import React, { useEffect, useState, useRef } from "react";
import styles from './FormMultiUpload.module.scss';

const CustomUpload = ({
                        initialImages = [],
                        onChange,
                      }) => {
  const [fileList, setFileList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const [zoom, setZoom] = useState(1); // Уровень увеличения
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 }); // Позиция мыши в %
  const [isDragging, setIsDragging] = useState(false); // Активность мыши
  const [imageOffset, setImageOffset] = useState({ x: 0, y: 0 }); // Смещение изображения
  const [startMousePosition, setStartMousePosition] = useState(null); // Начальная позиция мыши
  const [startImageOffset, setStartImageOffset] = useState({ x: 0, y: 0 }); // Начальное смещение изображения
  const isInitialized = useRef(false);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (!isInitialized.current && initialImages.length > 0) {
      const formattedImages = initialImages.map((url, index) => ({
        uid: `initial-${index}`,
        name: `Image ${index + 1}`,
        status: "done",
        url: `https://api.mytoy.am/${url}`,
      }));
      setFileList(formattedImages);
      isInitialized.current = true;
    }
  }, [initialImages]);

  const handleFileChange = (event) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files).map((file, index) => ({
        uid: `${Date.now()}-${index}`,
        name: file.name,
        status: "done",
        preview: URL.createObjectURL(file),
        file,
      }));
      const updatedFileList = [...fileList, ...newFiles];
      setFileList(updatedFileList);
      onChange?.(updatedFileList);
    }
  };

  const handleRemove = (uid) => {
    const updatedFileList = fileList.filter((file) => file.uid !== uid);
    setFileList(updatedFileList);
    onChange?.(updatedFileList);
  };

  const openModal = (file) => {
    setCurrentImage(file.preview || file.url || null);
    setIsModalVisible(true);
    setZoom(1);
    setMousePosition({ x: 50, y: 50 });
    setImageOffset({ x: 0, y: 0 });
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setCurrentImage(null);
  };
  const handleTouchStart = (e) => {
    const touch = e.touches[0];

    if (lastTap && Date.now() - lastTap < 1000) {
      // Если прошло меньше 300 мс с последнего касания — считаем это двойным тапом
      handleDoubleClick(touch);
      lastTap = 0; // Сбрасываем время последнего касания
      return;
    }

    lastTap = Date.now(); // Обновляем время последнего касания

    if (zoom <= 1) return; // Не начинаем перетаскивание, если нет увеличения

    setIsDragging(true);
    setStartMousePosition({ x: touch.clientX, y: touch.clientY });
    setStartImageOffset({ ...imageOffset });
  };

  const handleTouchMove = (e) => {
    if (!isDragging || zoom <= 1) return;

    const touch = e.touches[0];
    const container = e.currentTarget.getBoundingClientRect();

    const imageWidth = container.width * zoom;
    const imageHeight = container.height * zoom;

    const maxOffsetX = (imageWidth - container.width) / 2;
    const maxOffsetY = (imageHeight - container.height) / 2;

    const dx = (touch.clientX - startMousePosition.x) / zoom;
    const dy = (touch.clientY - startMousePosition.y) / zoom;

    setImageOffset({
      x: Math.min(maxOffsetX, Math.max(-maxOffsetX, startImageOffset.x + dx)),
      y: Math.min(maxOffsetY, Math.max(-maxOffsetY, startImageOffset.y + dy)),
    });
  };

  const handleTouchEnd = () => setIsDragging(false);

  const handleMouseDown = (e) => {
    if (zoom <= 1) return; // Не позволяем перетаскивать при отсутствии увеличения
    setIsDragging(true);
    setStartMousePosition({ x: e.clientX, y: e.clientY });
    setStartImageOffset({ ...imageOffset });
  };

  const handleMouseMove = (e) => {
    if (!isDragging || zoom <= 1) return;

    const container = e.currentTarget.getBoundingClientRect();

    const imageWidth = container.width * zoom;
    const imageHeight = container.height * zoom;

    const maxOffsetX = (imageWidth - container.width) / 2;
    const maxOffsetY = (imageHeight - container.height) / 2;

    const dx = (e.clientX - startMousePosition.x) / zoom;
    const dy = (e.clientY - startMousePosition.y) / zoom;

    setImageOffset({
      x: Math.min(maxOffsetX, Math.max(-maxOffsetX, startImageOffset.x + dx)),
      y: Math.min(maxOffsetY, Math.max(-maxOffsetY, startImageOffset.y + dy)),
    });
  };

  let lastTap = 0; // Время последнего касания

  const handleDoubleTap = (e) => {
    handleDoubleClick(e); // Просто вызываем вашу функцию для двойного клика
  };
  const handleDoubleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setMousePosition({ x, y });
    setZoom((prevZoom) => {
      if (prevZoom === 3) {
        setImageOffset({ x: 0, y: 0 }); // Reset to center
        return 1;
      }
      return prevZoom + 0.5;
    });
  };

  const handleZoomIn = () => {
    if (zoom < 3) setZoom((prev) => prev + 0.5);
  };

  const handleZoomOut = () => {
    if (zoom > 1) setZoom((prev) => {
      if (prev - 0.5 === 1) setImageOffset({ x: 0, y: 0 }); // Reset position when fully zoomed out
      return prev - 0.5;
    });
  };



  const handleMouseUp = () => setIsDragging(false);
  const handleMouseLeave = () => setIsDragging(false);

  const uploadButton = (
    <label
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100px",
        height: "100px",
        border: "1px dashed #d9d9d9",
        borderRadius: "4px",
        cursor: "pointer",
      }}
    >
      <div style={{ fontSize: "24px", color: "#999" }}>+</div>
      <div style={{ marginTop: "8px", color: "#999" }}>Upload</div>
      <input
        type="file"
        accept="image/*"
        multiple
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </label>
  );

  return (
    <div>
      <div className={styles.container}>
        {fileList.map((file) => (
          <div key={file.uid} className={styles.fileCard}>
            <img
              src={file.preview || file.url}
              alt={file.name}
              onClick={() => openModal(file)}
            />
            <button
              className={styles.removeButton}
              onClick={() => handleRemove(file.uid)}
            >
              ✕
            </button>
          </div>
        ))}
        {fileList.length < 8 && (
          <label className={styles.uploadButton}>
            <div className={styles.plusIcon}>+</div>
            <span className={styles.uploadText}>Upload</span>
            <input
              type="file"
              accept="image/*"
              multiple
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
          </label>
        )}
      </div>


      {isModalVisible && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            overflow: "hidden",
          }}
          onClick={closeModal}
        >
          <div
            style={{
              position: 'relative',
              width: '80%',
              height: '80%',
              backgroundColor: '#fff',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
            onTouchStart={(e) => {
              handleTouchStart(e);

            }}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onDoubleClick={handleDoubleClick}
          >
            <img
              src={currentImage || ''}
              alt="Preview"
              style={{
                transform: `translate(${imageOffset.x}px, ${imageOffset.y}px) scale(${zoom})`,
                transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
                cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default',
                transition: isDragging ? 'none' : 'transform 0.3s ease',
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain' // Ensures image scales properly
              }}
              draggable={false}
            />


          </div>

          <div className={styles.zoomContainer}>
            <button
              className={styles.zoomBtn}
              onClick={(e) => {
                e.stopPropagation();
                handleZoomIn();
              }}
            >
              +
            </button>
            <button
              className={styles.zoomBtn}
              onClick={(e) => {
                e.stopPropagation();
                handleZoomOut();
              }}
            >
              -
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomUpload;
