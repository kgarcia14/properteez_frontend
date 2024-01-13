import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";
import { useState } from "react";
import styles from '../../styles/PropertyModal.module.css'

export default function PropertyModal({ isOpen, onClose, property }) {
  const [deleteButton, setDeleteButton] = useState(true);
  const [confirmDeleteButton, setConfirmDeleteButton] = useState(false)

  const handleDelete = () => {
    setDeleteButton(false);
    setConfirmDeleteButton(true);
  }

  const cancelDelete = () => {
    setDeleteButton(true);
    setConfirmDeleteButton(false);
  }

  const confirmDelete = async () => {
    try {
      const res = await fetch(process.env.NODE_ENV === 'development' ? `http://localhost:3333/properties/${property.id}` : `https://properteezapi.kurtisgarcia.dev/properties/${property.id}`, 
      {
        method: 'DELETE',
        credentials: 'include',
      });
  
      if (res.status === 204) {
        location.assign('/dashboard')
      }

    } catch (err) {
      console.log(err)
    }
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={() => {onClose(); cancelDelete();}}>
      <ModalContent>
          {(onClose) => (
          <>
              <ModalHeader className="flex flex-col gap-1">{property.street}</ModalHeader>
                <ModalBody>
                  <img src={property.property_image} alt="" />
                  <p>
                      {property.street}
                  </p>
                  <p>
                      {property.city}, {property.state} {property.zip}
                  </p>
                  <p>{property.home_type}</p>
                </ModalBody>
              <ModalFooter>
              <Button className={styles.editButton} onPress={onClose}>
                  Edit
              </Button>
              <Button className={deleteButton ? styles.deleteButton : styles.hidden} color="danger" variant="light" onClick={handleDelete}>
                  Delete
              </Button>
              <Button className={confirmDeleteButton ? styles.confirmDeleteButton : styles.hidden} color="danger" variant="light" onPress={onClose} onClick={confirmDelete}>
                  Confirm Delete
              </Button>
              </ModalFooter>
          </>
          )}
      </ModalContent>
    </Modal>
  );
}