
import { useEffect, useState } from 'react';

import {
  X,
  GraduationCap,
  Upload,
  Send,
  User,
  Mail,
  Phone,
  Building2,
  Globe,
  Award,
  Presentation
} from 'lucide-react';

import './RegistrationModal.css';

function RegistrationModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 1000);

    const openRegistration = () => {
      setIsOpen(true);
    };

    window.addEventListener('open-registration', openRegistration);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('open-registration', openRegistration);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';

    const handleEscape = (event) => {
      if (event.key === 'Escape' && !isSubmitting) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, isSubmitting]);

  const closeModal = () => {
    if (!isSubmitting) {
      setIsOpen(false);
    }
  };

  // PAPER FILE VALIDATION
  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (!file) {
      setSelectedFile(null);
      return;
    }

    const allowedExtensions = ['pdf', 'doc', 'docx'];
    const extension = file.name.split('.').pop().toLowerCase();

    if (!allowedExtensions.includes(extension)) {
      alert('Please select a PDF, DOC or DOCX file.');
      event.target.value = '';
      setSelectedFile(null);
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10 MB.');
      event.target.value = '';
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  // REGISTRATION AND PAPER SUBMISSION
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSubmitting) return;

    const form = event.currentTarget;
    const data = new FormData(form);

    const paperFile = data.get('paperFile');

    const registrationData = {
      fullName: data.get('fullName'),
      email: data.get('email'),
      alternateEmail: data.get('alternateEmail'),
      mobile: data.get('mobile'),
      institution: data.get('institution'),
      country: data.get('country'),
      participantCategory: data.get('category'),
      presentationType: data.get('presentation')
    };

    setIsSubmitting(true);

    // Open Gmail before asynchronous requests
    const gmailWindow = window.open('', '_blank');

    try {
      // STEP 1: SAVE REGISTRATION
      console.log('STEP 1: Sending registration...');

      const response = await fetch(
        'http://localhost:5000/api/registration',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(registrationData)
        }
      );

      const result = await response.json();

      console.log('Registration response:', result);

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || 'Registration failed.'
        );
      }

      // STEP 2: UPLOAD PAPER
      let paperUploaded = false;

      if (paperFile instanceof File && paperFile.size > 0) {
        console.log('STEP 2: Uploading paper:', paperFile.name);

        const paperData = new FormData();

        paperData.append(
          'participantName',
          registrationData.fullName
        );

        paperData.append(
          'email',
          registrationData.email
        );

        paperData.append(
          'paperFile',
          paperFile
        );

        const paperResponse = await fetch(
          'http://localhost:5000/api/papers/submit',
          {
            method: 'POST',
            body: paperData
          }
        );

        const paperResult = await paperResponse.json();

        console.log('Paper upload response:', paperResult);

        if (!paperResponse.ok || !paperResult.success) {
          throw new Error(
            'Registration saved, but paper upload failed: ' +
            (paperResult.message || 'Unknown upload error')
          );
        }

        paperUploaded = true;

        console.log('PAPER UPLOAD SUCCESSFUL');
      } else {
        console.log('No paper file selected.');
      }

      // STEP 3: PREPARE GMAIL MESSAGE
      const subject =
        'CONFERA 2027 - Research Paper Submission';

      const body = `
CONFERA 2027 - Registration Details

Full Name: ${registrationData.fullName}
Email: ${registrationData.email}
Alternate Email: ${registrationData.alternateEmail || 'Not provided'}

Mobile Number: ${registrationData.mobile}
Institution / Organization: ${registrationData.institution}
Country: ${registrationData.country}

Participant Category: ${registrationData.participantCategory}
Presentation Type: ${registrationData.presentationType}

Research Paper: ${paperUploaded ? paperFile.name : 'Not uploaded'}

Paper Upload Status: ${paperUploaded ? 'Uploaded successfully to CONFERA server' : 'No paper uploaded'}

Thank you.
      `;

      const gmailUrl =
        'https://mail.google.com/mail/?view=cm&fs=1' +
        '&to=suryaraju481@gmail.com' +
        '&su=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(body);

      if (gmailWindow) {
        gmailWindow.location.href = gmailUrl;
      }

      // STEP 4: RESET FORM
      form.reset();
      setSelectedFile(null);
      setIsOpen(false);

      alert(
        paperUploaded
          ? 'Registration and research paper uploaded successfully!'
          : 'Registration successful! No research paper was uploaded.'
      );

    } catch (error) {
      if (gmailWindow) {
        gmailWindow.close();
      }

      console.error('CONFERA SUBMISSION ERROR:', error);

      alert(
        error.message || 'Unable to submit. Please try again.'
      );

    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="registration-overlay"
      onClick={closeModal}
    >

      <div
        className="registration-modal"
        onClick={(event) => event.stopPropagation()}
      >

        {/* CLOSE BUTTON */}
        <button
          type="button"
          className="registration-close"
          onClick={closeModal}
          aria-label="Close registration"
          disabled={isSubmitting}
        >
          <X size={22} />
        </button>

        {/* DECORATIVE TOP LINE */}
        <div className="registration-top-line"></div>

        {/* HEADER */}
        <div className="registration-heading">

          <div className="registration-icon">
            <GraduationCap size={32} />
          </div>

          <span className="registration-brand">
            CONFERA 2027
          </span>

          <h2>
            Conference <span>Registration</span>
          </h2>

          <div className="registration-heading-line"></div>

          <p>
            Join us and be part of an international academic
            and research community.
          </p>

        </div>

        {/* REGISTRATION FORM */}
        <form
          className="registration-form"
          onSubmit={handleSubmit}
        >

          {/* PERSONAL INFORMATION */}
          <div className="registration-section-title">

            <span className="registration-section-icon">
              <User size={18} />
            </span>

            <div>
              <h3>Personal Information</h3>
              <p>Enter your basic contact details</p>
            </div>

          </div>

          <div className="registration-fields">

            {/* FULL NAME */}
            <div className="registration-field">

              <label htmlFor="fullName">
                Full Name <span>*</span>
              </label>

              <div className="registration-input-wrap">
                <User size={18} />

                <input
                  id="fullName"
                  type="text"
                  name="fullName"
                  placeholder="Enter your full name"
                  required
                />
              </div>

            </div>

            {/* EMAIL */}
            <div className="registration-field">

              <label htmlFor="email">
                Email Address <span>*</span>
              </label>

              <div className="registration-input-wrap">
                <Mail size={18} />

                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Enter your email address"
                  required
                />
              </div>

            </div>

            {/* ALTERNATE EMAIL */}
            <div className="registration-field">

              <label htmlFor="alternateEmail">
                Alternate Email
              </label>

              <div className="registration-input-wrap">
                <Mail size={18} />

                <input
                  id="alternateEmail"
                  type="email"
                  name="alternateEmail"
                  placeholder="Enter alternate email"
                />
              </div>

            </div>

            {/* MOBILE */}
            <div className="registration-field">

              <label htmlFor="mobile">
                Mobile Number <span>*</span>
              </label>

              <div className="registration-input-wrap">
                <Phone size={18} />

                <input
                  id="mobile"
                  type="tel"
                  name="mobile"
                  placeholder="Enter mobile number"
                  required
                />
              </div>

            </div>

            {/* INSTITUTION */}
            <div className="registration-field">

              <label htmlFor="institution">
                Institution / Organization <span>*</span>
              </label>

              <div className="registration-input-wrap">
                <Building2 size={18} />

                <input
                  id="institution"
                  type="text"
                  name="institution"
                  placeholder="Enter institution name"
                  required
                />
              </div>

            </div>

            {/* COUNTRY */}
            <div className="registration-field">

              <label htmlFor="country">
                Country <span>*</span>
              </label>

              <div className="registration-input-wrap">
                <Globe size={18} />

                <input
                  id="country"
                  type="text"
                  name="country"
                  placeholder="Enter your country"
                  required
                />
              </div>

            </div>

          </div>

          <div className="registration-divider"></div>

          {/* CONFERENCE INFORMATION */}
          <div className="registration-section-title">

            <span className="registration-section-icon">
              <Award size={18} />
            </span>

            <div>
              <h3>Conference Information</h3>
              <p>Select your participant and presentation details</p>
            </div>

          </div>

          <div className="registration-fields">

            {/* CATEGORY */}
            <div className="registration-field">

              <label htmlFor="category">
                Participant Category <span>*</span>
              </label>

              <div className="registration-input-wrap">
                <Award size={18} />

                <select
                  id="category"
                  name="category"
                  required
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select Category
                  </option>

                  <option value="UG / PG Student">
                    UG / PG Student
                  </option>

                  <option value="Research Scholar">
                    Research Scholar
                  </option>

                  <option value="Faculty">
                    Faculty
                  </option>

                  <option value="Industry Participant">
                    Industry Participant
                  </option>

                  <option value="Visitor">
                    Visitor
                  </option>

                </select>
              </div>

            </div>

            {/* PRESENTATION */}
            <div className="registration-field">

              <label htmlFor="presentation">
                Presentation Type <span>*</span>
              </label>

              <div className="registration-input-wrap">
                <Presentation size={18} />

                <select
                  id="presentation"
                  name="presentation"
                  required
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select Presentation Type
                  </option>

                  <option value="Online / Virtual Presentation">
                    Online / Virtual Presentation
                  </option>

                  <option value="College Presentation">
                    College Presentation
                  </option>

                  <option value="Conference Visitor">
                    Conference Visitor
                  </option>

                </select>
              </div>

            </div>

          </div>

          {/* PAPER UPLOAD */}
          <div className="registration-upload-section">

            <label className="registration-upload-label">
              Upload Research Paper
            </label>

            <label className="registration-upload">

              <div className="registration-upload-icon">
                <Upload size={24} />
              </div>

              <div className="registration-upload-text">

                <strong>
                  {selectedFile
                    ? selectedFile.name
                    : 'Choose your paper file'}
                </strong>

                <span>
                  PDF, DOC or DOCX format (Maximum 10 MB)
                </span>

              </div>

              <input
                type="file"
                name="paperFile"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
              />

            </label>

            <p className="registration-file-note">
              Upload your research paper directly.
              Accepted formats: PDF, DOC and DOCX.
            </p>

          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            className="registration-submit"
            disabled={isSubmitting}
          >

            <Send size={18} />

            {isSubmitting
              ? 'Submitting...'
              : 'Submit Registration'}

            <span>→</span>

          </button>

        </form>

        {/* FOOTER */}
        <div className="registration-bottom-note">

          <span></span>

          <p>
            RESEARCH · INNOVATION · KNOWLEDGE
          </p>

          <span></span>

        </div>

      </div>
    </div>
  );
}

export default RegistrationModal;
