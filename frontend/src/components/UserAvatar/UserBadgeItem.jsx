import { Box } from "@chakra-ui/react";
import React from "react";
import { CloseButton } from "@chakra-ui/react";

const UserBadgeItem = ({ user, deleteUser }) => {
  return (
      <Box
        px={2} //padding horizontal
        py={1} //padding vertical
        borderRadius="lg"
        display="flex"
        alignItems="center"
        m={1}
        mb={2}
        variant="solid"
        fontSize={12}
        backgroundColor="purple"
        color="white"
        cursor="pointer"
        onClick={deleteUser}
      >
        {user.name}
        <CloseButton onClick={deleteUser} pl={1} />
      </Box>
  );
};

export default UserBadgeItem;
