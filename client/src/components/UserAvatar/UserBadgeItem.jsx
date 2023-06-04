import { CloseIcon } from '@chakra-ui/icons'
import { Badge } from '@chakra-ui/react'
import React from 'react'

const UserBadgeItem = ({ user, noCrossIcon, handleFunction }) => {
    return (
        <Badge
            px={2}
            py={1}
            borderRadius="lg"
            m={1}
            mb={2}
            variant="solid"
            fontSize={{ base: '10', sm: '11', md: '12' }}
            colorScheme="whatsapp"
            color='black'
            cursor="pointer"
            onClick={handleFunction}
            border={'1px solid black'}
        >
            {typeof (user) === 'object' ? user.name : user}

            {!noCrossIcon ?
                <CloseIcon pl={1} /> : ""
            }
        </Badge>
    )
}

export default UserBadgeItem