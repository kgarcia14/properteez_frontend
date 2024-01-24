import { Modal, ModalContent, ModalHeader, ModalBody} from "@nextui-org/react";
import { useState, useEffect } from "react";
import styles from '../../styles/PropertyModal.module.css'
import Loading from './Loading'
import { FaRegEdit } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";

const PropertyModal = ({ isOpen, onClose, property }) => {
  const [loading, setLoading] = useState(false);
  const [confirmEditWrapper, setConfirmEditWrapper] = useState(false);
  const [editButton, setEditButton] = useState(true);
  const [confirmDeleteWrapper, setConfirmDeleteWrapper] = useState(false);
  const [deleteButton, setDeleteButton] = useState(true);
  const [scrollBehavior, setScrollBehavior] = useState('inside');

  const handleEdit = () => {
    setEditButton(false);
    setDeleteButton(false);
    setConfirmEditWrapper(true);
  }
  
  const handleDelete = () => {
    setEditButton(false);
    setDeleteButton(false);
    setConfirmDeleteWrapper(true);
  }
  
  const cancelEditDelete = () => {
    setEditButton(true);
    setDeleteButton(true);
    setConfirmEditWrapper(false);
    setConfirmDeleteWrapper(false);
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

  if (loading) {
    const loadingString = 'Loading...'
    return <Loading loadingString={loadingString} />
  } 

  return (
    <Modal className={styles.modalContent} isOpen={isOpen} onOpenChange={() => {onClose(); cancelEditDelete();}} scrollBehavior={scrollBehavior}>
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
                      <FaRegEdit className={editButton ? styles.editButton : styles.hidden} onClick={handleEdit} />
                      <div className={confirmEditWrapper ? styles.confirmEditWrapper : styles.hidden}>
                        <a className={styles.confirmEditButton} href={`/editProperty/${property.id}`}>
                          Edit Property
                        </a>
                      </div>
                      <FaRegTrashCan className={deleteButton ? styles.deleteButton : styles.hidden} onClick={handleDelete} />
                      <div className={confirmDeleteWrapper ? styles.confirmDeleteWrapper : styles.hidden}>
                        <p className={styles.confirmText}>Are you sure?</p>
                        <button className={styles.confirmDeleteButton} color="danger" variant="light" onClick={() => {confirmDelete(); onClose()}}>
                            Confirm Delete
                        </button>
                      </div>
                    </div>
                    <div className={styles.modalImageContainer}>
                      <img className={styles.modalImage} src={property.property_image} alt="" />
                    </div>
                    <div className={styles.propertyDetails}>
                      <div className={styles.addressAndStatusWrapper}>
                        <div>
                          <p className={styles.address}>
                            {property.street}<br/>
                            {property.city}, {property.state} {property.zip}
                          </p>
                          <p className={styles.homeType}>{property.home_type}</p>
                        </div>
                        <div>
                          <p className={property.rent_status === 'Past Due' ? `${styles.pastDueRentStatus}` : property.rent_status === 'Current' ? `${styles.currentRentStatus}` : `${styles.neutralRentStatus}`}>
                            {property.rent_status !== '' ? property.rent_status : 'Vacant'}
                          </p>
                        </div>
                      </div>
                      <div className={styles.rentMortgageProfitWrapper}>
                        <div>
                          <p className={styles.detailsTitle}>
                            Mortgage
                          </p>
                          <p className={styles.mortgageAmount}>
                            ${property.mortgage_amount}
                          </p>
                        </div>
                        <div>
                          <p className={styles.detailsTitle}>
                            Rent
                          </p>
                          <p className={styles.rentAmount}>
                            ${property.rent_amount}
                          </p>
                        </div>
                        <div>
                          <p className={styles.detailsTitle}>
                            Profit
                          </p>
                          <p className={styles.profitAmount}>
                            {property.rent_amount - property.mortgage_amount < 0 ? `-$${Math.abs(parseInt(property.rent_amount - property.mortgage_amount, 10))}` : `$${property.rent_amount - property.mortgage_amount}`}
                          </p>
                        </div>
                      </div>
                      <div className={styles.leaseTermWrapper}>
                          <p className={styles.detailsTitle}>
                            Lease Term
                          </p>
                          <p className={styles.homeType}>
                            {property.lease_start} - {property.lease_end}
                          </p>
                      </div>
                      {property.renter_name !== '' ? 
                        <div className={styles.renterDetailsContainer}>
                          <h3 className={styles.renterDetailsTitle}>Renter Details</h3>
                          <div className={styles.renterDetails}>
                              <p className={styles.detailsTitle}>
                                Name
                              </p>
                              <p className={styles.homeType}>
                                {property.renter_name}
                              </p>
                          </div>
                          <div className={styles.renterDetails}>
                              <p className={styles.detailsTitle}>
                                Phone
                              </p>
                              <p className={styles.homeType}>
                                {property.renter_number}
                              </p>
                          </div>
                          <div className={styles.renterDetails}>
                              <p className={styles.detailsTitle}>
                                Email
                              </p>
                              <p className={styles.homeType}>
                                {property.renter_email}
                              </p>
                          </div>
                        </div>  
                        : 
                        ''
                      }
                    </div>
                  </div>
                </div>
              </ModalBody>
          </>
          )}
      </ModalContent>
    </Modal>
  );
}

export default PropertyModal;