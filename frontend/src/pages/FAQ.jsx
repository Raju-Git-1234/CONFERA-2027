
import { useState } from 'react';
import './FAQ.css';

import {
  Plus,
  Minus,
  MessageCircle,
  HelpCircle
} from 'lucide-react';

const faqQuestions = [
  'Will all papers be published in International Journal?',
  'In case we cannot make our presence (absent) in the conference?',
  'Who are eligible for Video Presentation?',
  'Who is a Registered Author?',
  'What will be the presentation timing?',
  'What should the participants bring?'
];

function FAQ() {
  const [activeQuestion, setActiveQuestion] = useState(0);

  return (
    <section id="faq" className="faq-section">

      <div className="faq-container">

        {/* SECTION HEADING */}
        <div className="faq-main-heading">

          <span className="faq-eyebrow">
            <HelpCircle size={16} />
            CONFERA 2027
          </span>

          <h2>
            Frequently Asked <span>Questions</span>
          </h2>

          <div className="faq-heading-line"></div>

          <p>
            Find answers to common questions about CONFERA 2027.
          </p>

        </div>

        {/* FAQ TWO COLUMN LAYOUT */}
        <div className="faq-layout">

          {/* LEFT SIDE QUESTIONS */}
          <div className="faq-question-panel">

            <div className="faq-panel-heading">

              <div>
                <span>01 — FAQ</span>
                <h3>Have Questions?</h3>
              </div>

              <MessageCircle size={27} />

            </div>

            <div className="faq-question-list">

              {faqQuestions.map((question, index) => (
                <button
                  type="button"
                  key={index}
                  className={`faq-question ${
                    activeQuestion === index ? 'active' : ''
                  }`}
                  onClick={() => setActiveQuestion(index)}
                >

                  <span className="faq-question-number">
                    0{index + 1}
                  </span>

                  <span className="faq-question-text">
                    {question}
                  </span>

                  <span className="faq-question-icon">
                    {activeQuestion === index
                      ? <Minus size={18} />
                      : <Plus size={18} />
                    }
                  </span>

                </button>
              ))}

            </div>

            <div className="faq-panel-footer">
              <span></span>
              WE ARE HERE TO HELP
            </div>

          </div>

          {/* RIGHT SIDE ANSWER PANEL */}
          <div className="faq-answer-panel">

            <div className="faq-answer-top">

              <span className="faq-answer-label">
                <span></span>
                ANSWER
              </span>

              <span className="faq-answer-number">
                0{activeQuestion + 1} / 06
              </span>

            </div>

            <div
              className="faq-answer-content"
              key={activeQuestion}
            >

              <div className="faq-answer-icon">
                <MessageCircle size={27} />
              </div>

              <span className="faq-answer-small">
                YOUR QUESTION
              </span>

              <h3>
                {faqQuestions[activeQuestion]}
              </h3>

              <div className="faq-answer-divider"></div>

              <p>
                Official information regarding this question will be
                provided by the CONFERA 2027 organizing committee.
                Please check the conference announcements for updates.
              </p>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}

export default FAQ;
