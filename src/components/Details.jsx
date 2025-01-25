import React, { useEffect, useState } from "react"; // Import React and hooks
import { useDispatch, useSelector, shallowEqual } from "react-redux"; // Import useSelector and useDispatch from react-redux
import { Box, Flex, Grid, Heading, Icon, Text, useToast } from "@chakra-ui/react"; // Chakra UI components
import { celsius } from "../helpers/extraFunctions"; // Helper function
import { getItem } from "../helpers/sessionStorage"; // Helper function for session storage
import { getWeatherByLocation, syncData } from "../redux/actions"; // Redux actions
import { Error } from "./Error"; // Error component
import { Loading } from "./Loading"; // Loading component
import { Map } from "./Map"; // Map component
import { FaSyncAlt } from "react-icons/fa"; // Sync icon
import { Newbox, NewText } from "./SmallComponents"; // Custom components
import { Forcast } from "./Forcast"; // Forecast component
import { formatUnixTimestampToHourMinute } from "../helpers/Timestamp"; // Timestamp helper


export const Deatils = () => {
    const { isLoading, weatherData: data, forcastData = [], isError } = useSelector((state) => state, shallowEqual);
    const [isRotate, setIsRotate] = useState(false);
    const dispatch = useDispatch();
    const toast = useToast();
    
    useEffect(() => {
        let weather = getItem("weather");
        !weather && dispatch(getWeatherByLocation(toast));
    }, [dispatch, toast]);

    const handleSyncData = () => {
        setIsRotate(true);
        dispatch(syncData(data.name, toast));
    };

    return isLoading ? (
        <Loading />
    ) : isError ? (
        <Error />
    ) : (
        <>
            <Box maxW={'1400px'} m={'20px auto 5px'} p={'20px'} minH={'550px'}>
                <Grid gridTemplateColumns={['100%', 'repeat(2, 1fr)', 'repeat(2, 1fr)', '30% 27.5% 38%']} gap={'30px'}>
                    <Newbox>
                        <Box color={'#5e82f4'} p={'20px'} textAlign={'center'}>
                            <Flex justify={'end'}>
                                <Icon
                                    onClick={handleSyncData}
                                    onAnimationEnd={() => { setIsRotate(false); }}
                                    className={isRotate ? "iconRotate" : undefined}
                                    cursor={'pointer'} w={'23px'} h={'23px'} as={FaSyncAlt}
                                />
                            </Flex>
                            <Heading>{data.name}, {data.sys.country}</Heading>
                            <Heading fontSize={['100px', '120px', '120px', '100px', '120px']}>
                                {Math.round(data.main.temp)}<sup>o</sup>C
                            </Heading>

                            <Heading>{data.weather[0].main}</Heading>
                            <Heading>{data.population}</Heading>
                        </Box>
                    </Newbox>

                    <Newbox>
                    <Grid templateColumns={'50% 50%'} h={'100%'} p={'8px'}>
                    <Box py={'10px'} pl={'15%'}>
                        {['Felt Temp.', 'Humidity', 'Wind', 'Visibility', 'Max Temp.', 'Min Temp.', 'Sunrise', 'Sunset'].map((e, i) => (
                        <Text key={i} color={'#5e82f4'} fontWeight={500} mt={'15px'} fontSize={'18px'}>
                            {e}
                        </Text>
                        ))}
                    </Box>
                    <Box borderRadius={'30px'} bg={'#5e82f4'} py={'10px'} pl={'15%'}>
                        <NewText>{data?.main?.feels_like ? Math.round(data.main.feels_like) : "N/A"}<sup>o</sup> C</NewText>
                        <NewText>{data?.main?.humidity ? `${data.main.humidity}%` : "N/A"}</NewText>
                        <NewText>{data?.wind?.speed ? `${(data.wind.speed * 3.6).toFixed(2)} Km/h` : "N/A"}</NewText>
                        <NewText>{data?.visibility ? `${(data.visibility / 1000).toFixed(2)} Km` : "N/A"}</NewText>
                        <NewText>{data?.main?.temp_max ? Math.round(data.main.temp_max) : "N/A"}<sup>o</sup> C</NewText>
                        <NewText>{data?.main?.temp_min ? Math.round(data.main.temp_min) : "N/A"}<sup>o</sup> C</NewText>
                        <NewText>{data?.sys?.sunrise ? formatUnixTimestampToHourMinute(data.sys.sunrise) : "N/A"}</NewText>
                        <NewText>{data?.sys?.sunset ? formatUnixTimestampToHourMinute(data.sys.sunset) : "N/A"}</NewText>
                    </Box>
                    </Grid>

                    </Newbox>

                    <Newbox>
                        <Map city={data.name} />
                    </Newbox>
                </Grid>

                {/* Only render forecast if `forcastData` is available */}
                {forcastData && Array.isArray(forcastData) && forcastData.length > 0 && (
                    <Grid mt={'40px'} templateColumns={['repeat(2, 1fr)', 'repeat(3, 1fr)', 'repeat(4, 1fr)', 'repeat(5, 1fr)', 'repeat(8, 1fr)']} gap={'20px'}>
                        {forcastData.map((e, i) => <Forcast key={i} data={e} />)}
                    </Grid>
                )}
      
                 <div className="tagLine" style={{marginTop: "20px", position: "sticky", bottom: "0", zIndex: "19", backgroundColor: "white"}}>
                    <p id="madeByAditya">Made with 💓 by Aditya Pandey</p>
                </div>
            </Box >
        </>
    );
};






