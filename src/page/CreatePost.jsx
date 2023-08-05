import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SpeechButton from '../components/SpeechButton.jsx';

import { preview } from '../assets';
import { getRandomPrompt } from '../utils';
import { FormField, Loader } from '../components';

const CreatePost = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '', prompt: '', photo: '',
  });

  const [generatingImg, setGeneratingImg] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [text, setText] = useState('');
  const [surpriseText, setSurpriseText] = useState('');
  const [isSurprise, setIsSurprise] = useState(false);
  const [formValue, setFormValue] = useState('');
  const [generatingReply, setGeneratingReply] = useState('');
  const [reply, setReply] = useState('');

  useEffect(() => {
    if (surpriseText && !isListening) {
      setFormValue(surpriseText);
    } else {
      setSurpriseText('');
      setForm({ ...form, prompt: '' });
      setFormValue(text);
    }
  }, [surpriseText, isListening, text]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setText(e.target.value);
    setReply(e.target.value);
  };
  const handleSurpriseMe = () => {
    const randomPrompt = getRandomPrompt(form.prompt);
    setSurpriseText(randomPrompt);
    setForm({ ...form, prompt: surpriseText });
  };

  const generate_image = async (t) => {
    // e.preventDefault();
    console.log(formValue);

    if (formValue) {
      console.log(t);
      setGeneratingImg(true);
      const formData = new FormData();
      const { name, prompt } = form;
      formData.append('prompt', formValue);

      fetch('https://clipdrop-api.co/text-to-image/v1', {
        method: 'POST',
        headers: {
          'x-api-key': 'ed034c959c47dabdec1e038dfc2ed745c70a87dc692e344cc90cf8541d84b5af8e1fd19539a401011af7931071aae6b6',
        },
        body: formData,
      })
        .then((response) => response.blob()) // Convert response to Blob
        .then((blob) => {
          const imageURL = URL.createObjectURL(blob); // Create a URL for the Blob
          const imageElement = document.createElement('img');
          imageElement.src = imageURL;
          console.log(imageURL);
          setForm({ ...form, photo: imageElement.src });
        })
        .catch((error) => {
          console.error('Error:', error);
        })
        .finally(() => {
          setGeneratingImg(false);
        });
    } else {
      alert('Please provide proper prompt');
      setGeneratingImg(false);
    }
  };

  const generate_reply = async (t) => {
    // const axios = require('axios');
    if (formValue) {
      const options = {
        method: 'GET',
        url: 'https://bard-api.p.rapidapi.com/ask',
        params: {
          question: t,
          'bard___Secure-1PSID_cookie_value': 'ZAiTA7H0YhBm8WNNgZtFxWuPAiUGnkfvVuj0HQH2hzPJUTFh4PUfs47q7WKoSCM80N2nQg.',
        },
        headers: {
          'X-RapidAPI-Key': '4534840580msh60921ac7740e846p185aa7jsn1750f996df5f',
          'X-RapidAPI-Host': 'bard-api.p.rapidapi.com',
        },
      };
      const testing = async () => {
        try {
          const response = await axios.request(options);
          const { drafts } = response.data.response;
          setReply(drafts[0].content);
          setGeneratingReply(false);
        } catch (error) {
          console.error(error);
        }
      };
      testing();
    } else {
      alert('Please provide proper prompt');
      setGeneratingReply(false);
    }
  };

  const generateImage = async (e) => {
    e.preventDefault();
    setGeneratingImg(true);
    setForm({ ...form, prompt: text });
    generate_image(text);
  };
  const generateReply = async (e) => {
    e.preventDefault();
    setGeneratingReply(true);
    setReply('');
    setForm({ ...form, prompt: text });
    generate_reply(text);
  };

  return (
    <section className="max-w-7xl mx-auto">
      <div>
        <h1 className="font-bold text-[#222328] text-[20px] xs:text-[28px] sm:text-[36px]">VISUALS AND DESCRIPTIONS</h1>
        <h1 className="font-bold text-[#3A7FC1] sm:bottom-2 bottom-1 right-[2px] relative text-[9px] sm:text-[13px]">- POWERED BY
          AI-PEDIA
        </h1>
      </div>
      <form className="mt-16">
        <div className="flex flex-col gap-5 w-full h-full">

          <div className="flex justify-between">
            <FormField
              labelName="Prompt"
              type="text"
              name="prompt"
              placeholder={`${isListening ? 'Listening...' : 'Click to speak or Click SURPRISE ME'}`}
              onChange={handleChange}
              isSurpriseMe
              handleSurpriseMe={handleSurpriseMe}
              value={formValue}
            />

            <SpeechButton setValue={setText} currListenStatus={isListening} isListen={setIsListening} />
          </div>
          <div className="flex flex-col sm:flex-row gap-20">

            <div className="flex flex-col">
              <div
                className="relative bg-gray-50 border mx-auto border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-64 p-3 h-64 flex justify-center items-center"
              >
                {form.photo ? (
                  <img
                    src={form.photo}
                    alt={form.prompt}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <img
                    src={preview}
                    alt="preview"
                    className="w-9/12 h-9/12 object-contain opacity-40"
                  />
                )}

                {generatingImg && (
                <div
                  className="absolute inset-0 z-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] rounded-lg"
                >
                  <Loader />
                </div>
                )}
              </div>
              <div className="mt-5 flex gap-5">
                <button
                  type="button"
                  onClick={generateImage}
                  className={`${generatingImg ? 'bg-green-900' : 'bg-green-700'}  text-white hover:bg-green-900 font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center`}
                >
                  {generatingImg ? 'Generating...' : 'Generate Image'}
                </button>
              </div>
            </div>

            <div className="flex flex-col w-full">
              <div
                className={`${reply ? 'text-gray-700' : 'text-gray-400'} h-64 min-w-[16rem] w-full bg-gray-50 overflow-scroll border border-gray-300 rounded-lg ${generatingReply ? 'p-0' : 'p-3'} text-sm`}
              >
                <p className="capitalize break-normal">{reply}</p>
                {!reply && !generatingReply && (
                <p className="text-center text-gray-400">Speak anything to search</p>)}
                {generatingReply && (
                <div
                  className="inset-0 z-0 flex justify-center items-center rounded-lg h-full w-full bg-[rgba(0,0,0,0.5)]"
                >
                  <Loader />

                </div>
                )}
              </div>
              <div className="mt-5 flex gap-5">
                <button
                  type="button"
                  onClick={generateReply}
                  className={`${generatingReply ? 'bg-green-900' : 'bg-green-700'}  text-white hover:bg-green-900 font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center`}
                >
                  {generatingReply ? 'Generating...' : 'Generate Reply'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
};

export default CreatePost;
