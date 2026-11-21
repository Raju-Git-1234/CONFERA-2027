
import { useState } from 'react';
import './PaperSubmission.css';

import {
  Send,
  Mail,
  FileText,
  BookOpen,
  ArrowUpRight,
  CheckCircle2,
  ClipboardList,
  CreditCard,
  Award,
  ChevronDown
} from 'lucide-react';

// COLLAPSIBLE SECTION
function AccordionSection({ number, title, description, children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`submission-accordion ${isOpen ? 'active' : ''}`}>

      <button
        type="button"
        className="submission-accordion-header"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <div className="submission-accordion-title">
          <span>{number}</span>
          <div>
            <h3>{title}</h3>
            <p>{description}</p>
          </div>
        </div>

        <ChevronDown
          className="submission-chevron"
          size={23}
        />
      </button>

      {isOpen && (
        <div className="submission-accordion-content">
          {children}
        </div>
      )}

    </div>
  );
}

function PaperSubmission() {

  const openRegistration = (event) => {
    event.preventDefault();

    window.dispatchEvent(
      new Event('open-registration')
    );
  };

  const steps = [
    {
      number: '01',
      title: 'Paper / Article Submission',
      description:
        'Submit your article via email to submiticcet@gmail.com. Ensure your document meets the submission guidelines before sending.'
    },
    {
      number: '02',
      title: 'Acceptance & Acknowledgment',
      description:
        'Once your paper is reviewed, you will receive an acceptance email from the ICCET team.',
      note:
        'A unique paper ID will be assigned upon acceptance. Keep this ID for future correspondence.'
    },
    {
      number: '03',
      title: 'Registration Form & Payment',
      description:
        'The acceptance email will contain the registration form and payment link. Complete both to proceed.'
    },
    {
      number: '04',
      title: 'Final Acknowledgment',
      description:
        'After submitting the registration form and completing payment, you will receive final registration confirmation.'
    }
  ];

  const fees = [
    {
      category: 'UG, PG Student / Research Scholar / Faculty / Industry Participant',
      presentation: 'Online / Virtual Presentation – 1 Member',
      national: '₹1,800',
      international: 'USD 60'
    },
    {
      category: 'UG, PG Students / Research Scholars / Faculties / Industry Participants',
      presentation: 'Online / Virtual Presentation – 2 to 5 Members',
      national: '₹2,200',
      international: 'USD 65'
    },
    {
      category: 'UG, PG Students / Research Scholars / Faculties / Industry Participants',
      presentation: 'Virtual Presentation – 6 to 8 Members',
      national: '₹2,550',
      international: 'USD 70'
    },
    {
      category: 'UG, PG Student / Research Scholar / Faculty / Industry Participant',
      presentation: 'College Presentation – 1 Member',
      national: '₹2,200',
      international: 'USD 70'
    },
    {
      category: 'UG, PG Students / Research Scholars / Faculties / Industry Participants',
      presentation: 'College Presentation – 2 to 5 Members',
      national: '₹2,950',
      international: 'USD 75'
    },
    {
      category: 'Visitors',
      presentation: 'Conference Visitor',
      national: '₹1,000',
      international: 'USD 50'
    }
  ];

  return (
    <section id="submission" className="paper-submission-section">

      <div className="submission-glow submission-glow-one"></div>
      <div className="submission-glow submission-glow-two"></div>

      <div className="paper-submission-container">

        {/* HEADER */}
        <div className="submission-header">

          <span className="submission-label">
            <span></span>
            CONFERA 2027
            <span></span>
          </span>

          <h2>
            Paper <span>Submission</span>
          </h2>

          <div className="submission-title-line"></div>

          <p>
            Submit your research work and become part of an
            international academic and research community.
          </p>

        </div>

        {/* 01 SUBMISSION METHODS */}
        <AccordionSection
          number="01"
          title="Submission Methods"
          description="Paper submission and email details"
        >

          <div className="submission-method-card">

            <div className="submission-method-icon">
              <Send size={28} />
            </div>

            <h3>Submit Your Research Paper</h3>

            <p>
              Submit your research paper through the designated
              conference email address.
            </p>

            {/* OPEN REGISTRATION POPUP */}
            <a
              href="#registration"
              onClick={openRegistration}
              className="submission-email-button"
            >
              <Mail size={18} />
              Click Here to Submit the Papers
              <ArrowUpRight size={17} />
            </a>

            {/* CLICKABLE GMAIL ADDRESS */}
            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=submiticcet%40gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              className="submission-email-address"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '9px',
                marginTop: '18px',
                padding: '12px 22px',
                borderRadius: '50px',
                border: '1px solid rgba(218, 185, 112, 0.5)',
                background: 'rgba(218, 185, 112, 0.10)',
                color: '#dfc17d',
                textDecoration: 'none',
                fontWeight: 600,
                letterSpacing: '0.3px',
                transition: 'all 0.3s ease'
              }}
            >
              <Mail size={17} />
              submiticcet@gmail.com
              <ArrowUpRight size={15} />
            </a>

            <div className="submission-note">
              <CheckCircle2 size={18} />

              <p>
                The conference secretary will contact you within
                3 working days of submission with your paper ID
                and feedback. If you do not receive feedback,
                please follow up after 3 days.
              </p>
            </div>

          </div>

        </AccordionSection>

        {/* 02 PAPER TEMPLATES */}
        <AccordionSection
          number="02"
          title="Paper Templates"
          description="IEEE and Springer paper formatting"
        >

          <p className="submission-inner-description">
            Please follow the template to format your paper
            before submission.
          </p>

          <div className="submission-template-grid">

            <a
              href="https://iccet.com.in/files/template.doc"
              target="_blank"
              rel="noopener noreferrer"
              className="submission-template-card"
            >
              <div className="submission-template-icon">
                <BookOpen size={27} />
              </div>

              <div>
                <h3>IEEE Format</h3>
                <p>Download IEEE paper template</p>
              </div>

              <ArrowUpRight size={21} />
            </a>

            <a
              href="https://iccet.com.in/files/springer.docm"
              target="_blank"
              rel="noopener noreferrer"
              className="submission-template-card"
            >
              <div className="submission-template-icon">
                <FileText size={27} />
              </div>

              <div>
                <h3>Springer Format</h3>
                <p>Download Springer paper template</p>
              </div>

              <ArrowUpRight size={21} />
            </a>

          </div>

        </AccordionSection>

        {/* 03 SUBMISSION PROCESS */}
        <AccordionSection
          number="03"
          title="Research Paper Submission Process"
          description="Four steps to complete your submission"
        >

          <div className="submission-process-grid">

            {steps.map((step) => (
              <article
                className="submission-process-card"
                key={step.number}
              >

                <span className="submission-step-number">
                  {step.number}
                </span>

                <div className="submission-step-line"></div>

                <h3>{step.title}</h3>

                <p>{step.description}</p>

                {step.note && (
                  <div className="submission-step-note">
                    {step.note}
                  </div>
                )}

              </article>
            ))}

          </div>

        </AccordionSection>

        {/* 04 REGISTRATION FEES */}
        <AccordionSection
          number="04"
          title="Registration Fees"
          description="National and international participant fees"
        >

          <div className="submission-fee-table-wrapper">

            <table className="submission-fee-table">

              <thead>
                <tr>
                  <th>Participant Category</th>
                  <th>Presentation Type</th>
                  <th>National</th>
                  <th>International</th>
                </tr>
              </thead>

              <tbody>
                {fees.map((fee, index) => (
                  <tr key={index}>
                    <td>{fee.category}</td>
                    <td>{fee.presentation}</td>
                    <td className="submission-fee-value">
                      {fee.national}
                    </td>
                    <td className="submission-fee-value">
                      {fee.international}
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>

          </div>

        </AccordionSection>

        {/* 05 REGISTRATION INSTRUCTIONS */}
        <AccordionSection
          number="05"
          title="Registration Instructions"
          description="Important information for authors"
        >

          <div className="submission-instructions">

            <div className="submission-instructions-icon">
              <ClipboardList size={25} />
            </div>

            <div>
              <h3>Registration Instructions</h3>

              <p>
                <strong>For Authors:</strong> The registration
                procedure details will be included in your
                acceptance letter.
              </p>

              <p>
                Authors should complete the registration form
                and payment process using the details provided
                in the acceptance email.
              </p>
            </div>

          </div>

        </AccordionSection>

        {/* REGISTER NOW */}
        <div className="submission-cta">

          <div className="submission-cta-icon">
            <Award size={30} />
          </div>

          <div className="submission-cta-content">
            <span>CONFERA 2027</span>

            <h3>Ready to Join the Conference?</h3>

            <p>
              Complete your paper submission and get ready
              to connect with researchers and innovators.
            </p>
          </div>

          <a
            href="#registration"
            className="submission-register-button"
            onClick={openRegistration}
          >
            <CreditCard size={18} />
            Register Now
            <ArrowUpRight size={17} />
          </a>

        </div>

        {/* FOOTER */}
        <div className="submission-footer">
          <span></span>
          <p>RESEARCH · INNOVATION · KNOWLEDGE</p>
          <span></span>
        </div>

      </div>
    </section>
  );
}

export default PaperSubmission;
