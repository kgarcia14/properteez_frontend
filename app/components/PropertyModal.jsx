import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";
import { useState } from "react";

export default function PropertyModal({ isOpen, onClose, property }) {
  const [modalPlacement, setModalPlacement] = useState("center");

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose}>
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
              <Button color="danger" variant="light" onPress={onClose}>
                  Close
              </Button>
              <Button color="primary" onPress={onClose}>
                  Action
              </Button>
              </ModalFooter>
          </>
          )}
      </ModalContent>
    </Modal>
  );
}