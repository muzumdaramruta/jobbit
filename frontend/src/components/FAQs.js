import React, { useState, useEffect } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import '../css/FAQs.css';
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";


const FAQs = () => {
    const navigate = useNavigate();
    const [remainingTime, setRemainingTime] = useState(5);
    const jwtToken = Cookies.get("jwt");

    useEffect(() => {
        let timer;
        if (!jwtToken) {
            timer = setInterval(() => {
                setRemainingTime((prevTime) => {
                    if (prevTime === 1) {
                        // If time is up, redirect to login page
                        clearInterval(timer);
                        navigate("/auth");
                    }
                    return prevTime - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer); // Cleanup interval on component unmount
    }, [jwtToken, navigate]);

    const faqs = [
        { 
            id: 1, 
            title: 'How can I accesss and edit my Jobbit profile', 
            content: 'You need to click on the arrow to top most, will find the profile option there on click of profile you can edit.'
        },
        { 
            id: 2, 
            title: 'When I try to login my profile says your account has been freezed? How do I access my account', 
            content: 'The admin monitors the account and will freeze the account if any malicious activity has been performed. The account will be retained after 15 days'
        },
        {
            id: 3,
            title: 'How do I add a review and photo for a company',
            content: 'In the companies section tap on any company to provide a review  or upload a photo there are different tabs for each company'
        },
        {
            id: 4,
            title: 'How do employers select a profile',
            content: 'Based on their requirements.'
        },
    ];

    const [feedback, setFeedback] = useState(null);

    const handleReply = (response) => {
        setFeedback(response);
    };

    return (
        <div className="FAQs">
            <h2 className="faq-header">Commonly Asked Questions</h2>
            <p className="faq-description">The Jobbit experience is crafted to empower users in discovering career opportunities, engaging in meaningful conversations, and staying updated on topics relevant to their professional growth. Upon signing into the job portal, users are directed to their personalized dashboard, providing access to job listings, connections, profile management, messages, and notifications. The dashboard serves as a central hub for users to explore job postings from various companies and industries, connect with potential employers, and stay informed about the latest trends in their field. Additionally, the job portal's feed delivers curated job recommendations, industry insights, and updates from companies and recruiters, facilitating seamless navigation and engagement for users seeking to advance their careers.</p>
            {faqs.map((faq) => (
                <Accordion key={faq.id}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls={`panel${faq.id}-content`}
                        id={`panel${faq.id}-header`}
                    >
                        <Typography className="faq-title">{faq.title}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography className="faq-content">{faq.content}</Typography>
                    </AccordionDetails>
                </Accordion>
            ))}
            {feedback === null ? (
                <div className="feedback-dialog">
                    <p>Was this helpful?</p>
                    <div className="feedback-buttons">
                        <button className="feedback-button" onClick={() => handleReply('Yes')}>Yes</button>
                        <button className="feedback-button" onClick={() => handleReply('No')}>No</button>
                    </div>
                </div>
            ) : (
                <div className="thanks-message">
                    <p>Thanks for letting us know!</p>
                </div>
            )}
        </div>
    );
};

export default FAQs;
