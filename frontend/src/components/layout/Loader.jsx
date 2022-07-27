import { Flex } from '@chakra-ui/react';
import { Rings } from 'react-loader-spinner';

const Loader = () => {
    return (
        <Flex justify={"center"} align={"center"} h={"100vh"} >
            <Rings
                height="80"
                width="80"
                color="#5271ff"
                radius="6"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
                ariaLabel="rings-loading"
            />
        </Flex>
    )
}

export default Loader;