import { Modal, ModalContent, ModalHeader, ModalBody} from "@nextui-org/react";
import { useState, useEffect } from "react";
import styles from '../../styles/DetailsModal.module.css'
import Loading from './Loading'
import { FaRegEdit } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";

const DetailsModal = ({ isOpen, onClose, data }) => {
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
      const res = await fetch(process.env.NODE_ENV === 'development' ? `http://localhost:3333/${data.home_type ? 'properties' : 'tasks'}/${data.id}` : `https://properteezapi.kurtisgarcia.dev/${data.home_type ? 'properties' : 'tasks'}/${data.id}`, 
      {
        method: 'DELETE',
        credentials: 'include',
      });
  
      if (res.status === 204) {
        location.assign(data.home_type ? '/dashboard' : '/tasks')
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
                    <ModalHeader className={styles.modalHeader}>{data.home_type ? data.street : data.location}</ModalHeader>
                  </div>
                  <div className={styles.editDeleteContainer}>
                    <FaRegEdit className={editButton ? styles.editButton : styles.hidden} onClick={handleEdit} />
                    <div className={confirmEditWrapper ? styles.confirmEditWrapper : styles.hidden}>
                      <a className={styles.confirmEditButton} href={`/${data.home_type ? 'editProperty' : 'editTask'}/${data.id}`}>
                        {data.home_type ? 'Edit property' : 'Edit Task'}
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
                  {data.home_type ? 
                    <>
                      <div className={styles.modalImageContainer}>
                        <img className={styles.modalImage} src={data.property_image} alt="" />
                      </div>
                      <div className={styles.dataDetails}>
                        <div className={styles.addressAndStatusWrapper}>
                          <div>
                            <p className={styles.address}>
                              {data.street}<br/>
                              {data.city}, {data.state} {data.zip}
                            </p>
                            <p className={styles.homeType}>{data.home_type}</p>
                          </div>
                          <div>
                            <p className={data.rent_status === 'Past Due' ? `${styles.pastDueRentStatus}` : data.rent_status === 'Current' ? `${styles.currentRentStatus}` : `${styles.neutralRentStatus}`}>
                              {data.rent_status !== '' ? data.rent_status : data.vacancy === 'Occupied' ? 'Occupied' : 'Vacant'}
                            </p>
                          </div>
                        </div>
                        <div className={styles.rentMortgageProfitWrapper}>
                          <div>
                            <p className={styles.detailsTitle}>
                              Mortgage
                            </p>
                            <p className={styles.mortgageAmount}>
                              ${data.mortgage_amount}
                            </p>
                          </div>
                          <div>
                            <p className={styles.detailsTitle}>
                              Rent
                            </p>
                            <p className={styles.rentAmount}>
                              ${data.rent_amount}
                            </p>
                          </div>
                          <div>
                            <p className={styles.detailsTitle}>
                              Profit
                            </p>
                            <p className={styles.profitAmount}>
                              {data.rent_amount - data.mortgage_amount < 0 ? `-$${Math.abs(parseInt(data.rent_amount - data.mortgage_amount, 10))}` : `$${data.rent_amount - data.mortgage_amount}`}
                            </p>
                          </div>
                        </div>
                        <div className={styles.leaseTermWrapper}>
                            <p className={styles.detailsTitle}>
                              Lease Term
                            </p>
                            <p className={styles.homeType}>
                              {data.lease_start} - {data.lease_end}
                            </p>
                        </div>
                        {data.renter_name !== '' ? 
                          <div className={styles.renterDetailsContainer}>
                            <h3 className={styles.renterDetailsTitle}>Renter Details</h3>
                            <div className={styles.renterDetails}>
                                <p className={styles.detailsTitle}>
                                  Name
                                </p>
                                <p className={styles.homeType}>
                                  {data.renter_name}
                                </p>
                            </div>
                            <div className={styles.renterDetails}>
                                <p className={styles.detailsTitle}>
                                  Phone
                                </p>
                                <p className={styles.homeType}>
                                  {data.renter_number}
                                </p>
                            </div>
                            <div className={styles.renterDetails}>
                                <p className={styles.detailsTitle}>
                                  Email
                                </p>
                                <p className={styles.homeType}>
                                  {data.renter_email}
                                </p>
                            </div>
                          </div>  
                          : 
                          ''
                        }
                      </div>
                    </>
                    : 
                    <>
                      <div className={styles.taskModalContainer}>
                        <div className={styles.titleLocationStatusWrapper}>
                          <div>
                            <p className={styles.address}>{data.title}</p>
                            <p className={styles.homeType}>{data.location}</p>
                          </div>
                          <div>
                            <p className={data.status === 'Urgent' && !data.complete ? `${styles.urgentStatus}` : data.status === 'Pending' && !data.complete ? `${styles.pendingStatus}` : `${styles.completeStatus}`}>{data.complete ? 'Complete' : data.status}</p>
                          </div>
                        </div>
                        <p className={styles.address}>Description:</p>
                        <p className={styles.homeType}>{data.description}</p>
                      </div>
                    </>
                  }
                </div>
              </div>
            </ModalBody>
          </>
          )}
      </ModalContent>
    </Modal>
  );
}

export default DetailsModal;