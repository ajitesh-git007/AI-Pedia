import UseSpeechRecognition from './UseSpeechRecognition.jsx';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faMicrophone} from '@fortawesome/free-solid-svg-icons';

const SpeechButton = ({setValue, isListen, setPromptNull, currListenStatus}) => {
    const {text, listening, start, hasRecognitionSupport, stop} = UseSpeechRecognition();
    return (
        <div className={'block'} onClick={() => setPromptNull}>
            {
                hasRecognitionSupport ? (
                    <>
                        <div className={''} onClick={() => {
                            if (listening) {
                                stop();
                            } else {
                                start();
                            }
                        }}>
                            <div className={`cursor-pointer text-2xl flex ml-5 mt-[29px] ${currListenStatus ? 'border-red-300' : 'border-gray-300'} rounded-full border-[3px] w-12 h-12 items-center justify-center`}>
                                {currListenStatus ? <FontAwesomeIcon  className={'text-red-500'}
                                                                     icon={faMicrophone} beatFade/> :
                                    <FontAwesomeIcon className={'text-gray-700'} icon={faMicrophone}/> }
                            </div>
                        </div>

                        {listening ? isListen(true) : isListen(false)}
                        {setValue(text)}
                    </>
                ) : (
                    <p>Sorry, your browser doesn't support speech recognition.</p>
                )
            }
        </div>
    );
};

export default SpeechButton;
