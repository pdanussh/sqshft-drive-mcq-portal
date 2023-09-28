import React from "react";
import "./index.css";

export const Modal = ({ show, hideModal, content }) => {
  if (!show) {
    return <React.Fragment />;
  }
  return (
    <div
      className={`modal modal-show modal-visible `}
      tabIndex="-1"
      role="dialog"
    >
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header header">
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
              onClick={hideModal}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">{content}</div>
          <div className="modal-footer footer">
            <button
              type="button"
              className="btn btn-primary"
              data-dismiss="modal"
              onClick={hideModal}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
