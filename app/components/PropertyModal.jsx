import { Modal, ModalContent, ModalHeader, ModalBody} from "@nextui-org/react";
import { useState, useEffect } from "react";
import styles from '../../styles/PropertyModal.module.css'

const PropertyModal = ({ isOpen, onClose, property }) => {
  const [deleteButton, setDeleteButton] = useState(true);
  const [confirmDeleteButton, setConfirmDeleteButton] = useState(false);

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
              <ModalBody className={styles.modalBody}>
                <div className={styles.modalContentContainer}>
                  <div className={styles.modalContentWrapper}>
                    <div>
                      <ModalHeader className={styles.modalHeader}>{property.street}</ModalHeader>
                    </div>
                    <div className={styles.editDeleteContainer}>
                      <button className={styles.editButton} onClick={onClose}>
                          Edit
                      </button>
                      <button className={deleteButton ? styles.deleteButton : styles.hidden} color="danger" variant="light" onClick={handleDelete}>
                          Delete
                      </button>
                      <button className={confirmDeleteButton ? styles.confirmDeleteButton : styles.hidden} color="danger" variant="light" onClick={() => {confirmDelete(); onClose()}}>
                          Confirm Delete
                      </button>
                    </div>
                    <div className={styles.modalImageContainer}>
                      <img className={styles.modalImage} src={property.property_image} alt="" />
                    </div>
                    <div className={styles.propertyDetails}>
                      <div>
                        <p className={styles.address}>
                          {property.street}<br/>
                          {property.city}, {property.state} {property.zip}
                        </p>
                        <p className={styles.homeType}>{property.home_type}</p>
                      </div>
                      <div className={styles.rentMortgageProfitWrapper}>
                        <div>
                          <p className={styles.rent}>
                            Rent
                          </p>
                          <p className={styles.rentAmount}>
                            ${property.rent_amount}
                          </p>
                        </div>
                        <div>
                          <p className={styles.mortgage}>
                            Mortgage
                          </p>
                          <p className={styles.mortgageAmount}>
                            ${property.mortgage_amount}
                          </p>
                        </div>
                        <div>
                          <p className={styles.profit}>
                            Profit
                          </p>
                          <p className={styles.profitAmount}>
                            ${property.rent_amount !== '' && property.mortgage_amount !== '' ? parseInt(property.rent_amount) - parseInt(property.mortgage_amount) 
                              : property.rent_amount === '' && property.mortgage_amount !== '' ? 0 - parseInt(property.mortgage_amount)
                              : '-'}
                          </p>
                        </div>
                      </div>
                      <div className={styles.leaseTermWrapper}>
                          <p className={styles.leaseTerm}>
                            Lease Term
                          </p>
                          <p className={styles.homeType}>
                            {property.lease_start} - {property.lease_end}
                          </p>
                        </div>
                    </div>
                  </div>
                </div>
              </ModalBody>
              {/* <ModalFooter>
              <Button className={styles.editButton} onPress={onClose}>
                  Edit
              </Button>
              <Button className={deleteButton ? styles.deleteButton : styles.hidden} color="danger" variant="light" onClick={handleDelete}>
                  Delete
              </Button>
              <Button className={confirmDeleteButton ? styles.confirmDeleteButton : styles.hidden} color="danger" variant="light" onPress={onClose} onClick={confirmDelete}>
                  Confirm Delete
              </Button>
              </ModalFooter> */}
          </>
          )}
      </ModalContent>
    </Modal>
  );
}

export default PropertyModal;