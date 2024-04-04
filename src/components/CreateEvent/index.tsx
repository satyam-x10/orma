import React, { useState, useEffect, useRef, useContext } from "react";
import Button from "../Button";
import Header from "../Header/header";
import MultiStepProgressBar from "./EventDetailsProgress";
import "./index.css";
import { useNavigate } from "react-router-dom";
import packages from "./Packages";
import moment from "moment";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;
import createEventImage from "../../assets/logo.svg";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import PaymentForm from "./PaymentForm";
const STRIPE_KEY = import.meta.env.VITE_STRIPE_KEY;
import Cookies from "js-cookie";
import axiosInstance from "../../api";
import AuthContext from "../../context/auth/AuthContext";

const stripePromise = loadStripe(STRIPE_KEY);

interface PricingData {
  id: number;
  guest_count: number;
  cost: string;
  Feature: Feature[];
}

interface Feature {
  id: number;
  name: string;
  pricingId: number;
}

const EventForm = () => {
  const [name, setName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [banner, setBanner] = useState<File | null>(null);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);
  const [price, setPrice] = useState("");
  const [priceId, setPriceId] = useState("");
  const [hash, setHash] = useState("");

  const date = moment();
  const futureDate = date.clone().add(3, "days");
  const formattedDate = futureDate.format("MM/DD/YYYY");
  const minDate = date.format('YYYY-MM-DD'); // Format date as YYYY-MM-DD

  const navigate = useNavigate();

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files && e.target.files[0];

    if (selectedFile) {if (!selectedFile.type.startsWith('image/')) {
      setError('Please select an image file.');
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("File size exceeds the limit of 5MB.");
      return;
    }
    
    if (e.target.files) {
      setError("")
      setBanner(e.target.files[0]);
    }}
  };

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files && e.target.files[0];
    if (selectedFile) {
      if (!selectedFile.type.startsWith('image/')) {
        setError('Please select an image file.');
        return;
      }

      if (selectedFile.size > 5 * 1024 * 1024) {
        setError("File size exceeds the limit of 5MB.");
        return;
      }

      if (e.target.files) {
        setError("")
        setProfileImage(e.target.files[0]);
      }
    }
  };

  const [pricingdata, setPricingData] = useState<PricingData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/events/photo/pricing`);
        setPricingData(response.data.pricing);
      } catch (e) {
        console.error(e);
      }
    }; 

    fetchData();
  }, []);

  let token = Cookies.get("token");

  if (!token) {
    navigate("./login");
  }

  const [disabled, setDisable] = useState(true);

  const { user } = useContext(AuthContext);
  const user_id = user?.id.toString();
  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("event_date", eventDate);
    if (banner) formData.append("banner", banner);
    if (profileImage) formData.append("profile_image", profileImage);
    if (user_id) formData.append("user_id", user_id);
    if (formData) {
      try {
        const response = await axiosInstance.post(
          `${API_URL}/events/create`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: token,
            },
          }
        );
        if (response.status === 200) {
          setHash(response.data.event_hash);
          setDisable(false);
        } else {
          console.error("Failed to create event");
        }
      } catch (e) {
        console.error("Error:", e);
      }
    }
  };

  const nextStep = () => {
    let currentError = "";
    switch (step) {
      case 1:
        if (!name) {
          currentError = "Please enter an event name";
        } else {
          setPage("page2");
        }
        break;
      case 2:
        if (!eventDate) {
          currentError = "Please enter an event date";
        } else {
          setPage("page3");
        }
        break;
      case 3:
        if (!banner) {
          currentError = "Please upload a banner image";
        } else {
          setPage("page4");
        }
        break;
      case 4:
        if (!profileImage) {
          currentError = "Please upload a profile image";
        } else {
          setPage("page5");
          handleSubmit();
          break;
        }
        break;
      case 5:
        if (price) {
          setPage("page6");
          break;
        }
      default: {
        break;
      }
    }
    setError(currentError);
    if (!currentError) {
      setStep(step + 1);
    }
  };

  const previousStep = () => {
    if (step > 1) {
      setError("");
      setStep(step - 1);
      setPage(`page${step - 1}`);
      setPrice("b");
    }
  };

  const [page, setPage] = useState("page1");

  const [position, setPosition] = useState(1);
  const pricing = [10, 50, 100, 250, 500, 750];

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPosition(parseInt(event.target.value, 10));
  };

  const isFirstRender = useRef(true);

  const handlePricing = async (pricing: any, priceId: any) => {
    setPrice(pricing);
    setPriceId(priceId);
  };


  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (price != "b") {
      nextStep();
    }
  }, [price]);

  const bannerInputRef = useRef(null);
  const profileInputRef = useRef(null);

  return (
    <div>
      <Header />
      <div className="orma-page-container-create page-container">
        <div className={"form-container"}>
          <MultiStepProgressBar page={page} />
         <div className="orma-page-container-image"><img
            src={createEventImage}
            alt="Your Image"
            className="right-side-image-phone"
          /></div>
          <form
            className="create-event-form"
            onSubmit={(e) => e.preventDefault()}
          >
            {
              {
                page1: step === 1 && (
                  <>
                    <h2 className="create-event-heading">
                      Let's name your Orma!
                    </h2>
                    <span className="create-event-subheading">
                      Please enter a name for your event.
                    </span>
                    <div className="create-event-input-div">
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Event Name"
                        className="create-event-input"
                      />
                    </div>
                  </>
                ),
                page2: step === 2 && (
                  <>
                    <h2 className="create-event-heading">
                      When is the big day?
                    </h2>
                    <span className="create-event-subheading">
                      Please choose your event date.
                    </span>
                    <div className="create-event-input-div">
                      <input
                        type="date"
                        value={eventDate}
                        min={minDate} 
                        defaultValue={formattedDate}
                        onChange={(e) => setEventDate(e.target.value)}
                        className="create-event-input"
                      />
                    </div>
                  </>
                ),
                page3: step === 3 && (
                  <>
                    <h2 className="create-event-heading">
                      Let's add a banner image
                    </h2>
                    <span className="create-event-subheading">
                      Please add a banner image for your event.
                    </span>
                    <div className="create-event-input-div">
                      <input
                        type="file"
                        ref={bannerInputRef}
                        onChange={handleBannerChange}
                        className="create-event-input"
                      />
                    </div>
                  </>
                ),
                page4: step === 4 && (
                  <>
                    <h2 className="create-event-heading">
                      Let's add a profile image
                    </h2>
                    <span className="create-event-subheading">
                      Please add a profile image for your event.
                    </span>
                    <div className="create-event-input-div">
                      <div></div>
                      <input
                        type="file"
                        ref={profileInputRef}
                        onChange={handleProfileImageChange}
                        className="create-event-input"
                      />
                    </div>
                  </>
                ),
                page5: step === 5 && pricingdata.length > 0 &&  (
                  <>
                    <h2 className="create-event-heading">
                      Plan according to your Guest List
                    </h2>
                    <span className="create-event-subheading">
                      Slide to select the number of guests below
                    </span>
                    <div>
                      <div className="pricing-slider-div">
                        <input
                          type="range"
                          min={1}
                          max={pricingdata.length}
                          step={1}
                          value={position}
                          onChange={handleSliderChange}
                          className="pricing-slider"
                        />
                        <div
                          style={{
                            left: position === 1 ? 0 : `calc(${(position / pricingdata.length) * 100}% - 68px)`,
                          }}
                          className="pricing-slider-tooltip"
                        >
                          {pricingdata[position - 1].guest_count}
                        </div>
                      </div>
                      {pricingdata
                        .slice(position - 1, position)
                        .map((pricingdata, index) => (
                          <div
                            key={pricingdata.id}
                            className="pricing-container"
                          >
                            <h3>${pricingdata.cost}</h3>
                            <ul className="pricing-feature-list">
                              {pricingdata.Feature.map((Feature, idx) => (
                                <li key={idx}>{Feature.name}</li>
                              ))}
                            </ul>
                            <button
                              disabled={disabled ? true : false}
                              className="pricing-select-button"
                              onClick={() =>
                                handlePricing(
                                  pricingdata.cost,
                                  pricingdata.id.toString()
                                )
                              }
                            >
                              Select
                            </button>
                          </div>
                        ))}
                    </div>
                  </>
                ),
                page6: step === 6 && (
                  <>
                    <Elements stripe={stripePromise}>
                      <PaymentForm
                        price={price}
                        price_id={priceId}
                        event_hash={hash}
                      />
                    </Elements>
                  </>
                ),
              }[page]
            }
             {error && <p className="error-message">{error}</p>}
            <div>
              {step > 1 && step < 5 && (
                <Button
                  type="button"
                  input={true}
                  value="← Back"
                  onClick={previousStep}
                  style={{
                    backgroundColor: "#000",
                    color: "#fff",
                    border: "none",
                    marginRight: "10px",
                    padding: "10px 20px",
                    fontSize: "15px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    marginBottom: "20px",
                  }}
                />
              )}
              {step < 5 && (
                <Button
                  type="button"
                  input={true}
                  value={"Next →"}
                  onClick={nextStep}
                  style={{
                    backgroundColor: "#000",
                    color: "#fff",
                    border: "none",
                    padding: "10px 20px",
                    fontSize: "15px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    marginBottom: "20px",
                  }}
                ></Button>
              )}
            </div>
          </form>
        </div>

        <img
          src={createEventImage}
          alt="Your Image"
          className="right-side-image"
        />
      </div>
    </div>
  );
};

export default EventForm;
