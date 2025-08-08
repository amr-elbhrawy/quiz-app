import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  useDisclosure,
} from "@heroui/react";
import { FaPlus, FaCheck, FaTimes } from "react-icons/fa";
import { useState } from "react";

export default function App() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [groupName, setGroupName] = useState("");
  const [selectedList, setSelectedList] = useState("");

  return (
    <>
      <Button
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-gray-100 rounded-full hover:bg-gray-200"
        onPress={onOpen}
      >
        <FaPlus />
        Add Group
      </Button>

      <Modal isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange} hideCloseButton>
        <ModalContent  >
          {(onClose) => (
            <>
              <ModalHeader className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Set up a new Group</h2>

                {/* Custom icons only, no duplicate close button */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      console.log("Group Name:", groupName);
                      console.log("Selected List:", selectedList);
                      onClose();
                    }}
                    className="text-green-600 hover:text-green-800 text-xl"
                    title="Create"
                  >
                    <FaCheck />
                  </button>

                  <button
                    onClick={onClose}
                    className="text-red-600 hover:text-red-800 text-xl"
                    title="Cancel"
                  >
                    <FaTimes />
                  </button>
                </div>
              </ModalHeader>

              <ModalBody>
                <div className="flex flex-col gap-4">
                  {/* Group Name InputGroup */}
                  <div className="flex items-center rounded-md border border-gray-300 overflow-hidden w-full">
                    <span className="bg-orange-100 px-3 py-2 text-sm text-gray-700 whitespace-nowrap">
                      Group Name
                    </span>
                    <input
                      type="text"
                      placeholder="Enter group name"
                      className="flex-1 px-3 py-2 outline-none text-sm"
                      value={groupName}
                      onChange={(e) => setGroupName(e.target.value)}
                    />
                  </div>

                  {/* List Students Dropdown */}
                  <div className="flex items-center rounded-md border border-gray-300 overflow-hidden w-full">
                    <span className="bg-orange-100 px-3 py-2 text-sm text-gray-700 whitespace-nowrap">
                      List Students
                    </span>
                    <select
                      className="flex-1 px-3 py-2 outline-none text-sm"
                      value={selectedList}
                      onChange={(e) => setSelectedList(e.target.value)}
                    >
                      <option value="">Select list</option>
                      <option value="listA">List A</option>
                      <option value="listB">List B</option>
                    </select>
                  </div>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
