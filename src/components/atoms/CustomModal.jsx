import Modal from "react-modal";
import { useId } from "react";

const CustomModal = ({
  isOpen,
  onRequestClose,
  onConfirm,
  title,
  content,
  confirmText,
  cancelText,
  isPending = false,
  pendingText = "처리 중...",
  variant = "confirm",
}) => {
  const titleId = useId();
  const descriptionId = useId();
  const requestClose = () => {
    if (!isPending) onRequestClose?.();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={requestClose}
      shouldCloseOnEsc={!isPending}
      shouldCloseOnOverlayClick={!isPending}
      aria={{ labelledby: titleId, describedby: descriptionId }}
      className="w-[calc(100%-2rem)] max-w-md max-h-[calc(100vh-2rem)] overflow-auto bg-white shadow-xl border-primary rounded-xl absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      overlayClassName="fixed inset-0 bg-black bg-opacity-30"
      contentLabel="Custom Modal"
    >
      <div className="p-4 grid-4">
        <div
          id={titleId}
          className="text-xl font-semibold text-center text-primary"
        >
          {title}
        </div>
        <div id={descriptionId}>{content}</div>
      </div>
      <div className="flex">
        {cancelText ? (
          <>
            <button
              type="button"
              onClick={requestClose}
              disabled={isPending}
              className="w-1/2 p-4 bg-gray-200 disabled:opacity-60"
            >
              {cancelText}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isPending}
              aria-busy={isPending}
              className={`w-1/2 p-4 text-white disabled:opacity-60 ${
                variant === "danger" ? "bg-red-600" : "bg-primary"
              }`}
            >
              {isPending ? pendingText : confirmText}
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            aria-busy={isPending}
            className="w-full p-4 text-white bg-primary disabled:opacity-60"
          >
            {isPending ? pendingText : confirmText}
          </button>
        )}
      </div>
    </Modal>
  );
};

export default CustomModal;
