
import './Papers.css';

import {
  Cpu,
  BriefcaseBusiness,
  Microscope,
  FileText,
  Send,
  CheckCircle2,
  Mail,
  BookOpen,
  ArrowUpRight
} from 'lucide-react';

function Papers() {
  const topics = [
    {
      icon: Cpu,
      title: 'Engineering & Technology',
      topics: [
        'Computer Engineering',
        'Electrical & Electronics Engineering',
        'Electronics & Communication Engineering',
        'Architectural Engineering',
        'Agricultural Engineering',
        'Acoustic Engineering',
        'Automotive Engineering',
        'Biomechanics',
        'Biomedical Engineering',
        'Biotechnology',
        'Chemical Engineering',
        'Civil Engineering',
        'Control Engineering',
        'Environmental Engineering',
        'Industrial Engineering',
        'Instrumentation',
        'Mechanical Engineering',
        'Materials Engineering',
        'Nuclear Engineering',
        'Nano Engineering',
        'Petroleum Engineering',
        'Space Engineering',
        'Sports Engineering',
        'Wind Engineering'
      ]
    },
    {
      icon: BriefcaseBusiness,
      title: 'Management',
      topics: [
        'Business Risk',
        'Marketing',
        'Human Resource',
        'International Operational Research',
        'International Business',
        'Trends in Medicine & Radiology'
      ]
    },
    {
      icon: Microscope,
      title: 'Medical & Science',
      topics: [
        'Oral Medicine and Radiology',
        'Oral Pathology',
        'Oral and Maxillofacial Surgery',
        'Prosthodontics',
        'Endodontics',
        'Pedodontics',
        'Periodontics',
        'Community Dentistry',
        'Biochemistry',
        'Biochemical Science',
        'Biochemical Engineering',
        'Environmental Science',
        'Measurement Science',
        'Nutrition',
        'Soil Science',
        'Horticulture'
      ]
    }
  ];

  const steps = [
    {
      number: '01',
      title: 'Paper / Article Submission',
      description:
        'Submit your research article through email to submiticcet@gmail.com. Ensure your document follows the submission guidelines.'
    },
    {
      number: '02',
      title: 'Acceptance & Acknowledgment',
      description:
        'After review, you will receive an acceptance email from the ICCET team with a unique paper ID.'
    },
    {
      number: '03',
      title: 'Registration & Payment',
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

  return (
    <section id="papers" className="call-papers-section">

      <div className="call-papers-glow call-glow-one"></div>
      <div className="call-papers-glow call-glow-two"></div>

      <div className="call-papers-container">

        {/* HEADER */}
        <div className="call-papers-header">

          <span className="call-papers-label">
            <span></span>
            CONFERA 2027
            <span></span>
          </span>

          <h2>
            Call for <span>Papers</span>
          </h2>

          <div className="call-papers-line"></div>

          <p>
            Researchers, academicians, industry professionals and
            students are invited to submit their original research
            contributions and innovative ideas.
          </p>

        </div>

        {/* TOPICS */}
        <div className="call-topics-heading">
          <span>01 / RESEARCH AREAS</span>
          <h3>Topics of Interest</h3>
          <p>
            Topics of interest for submission include, but are not
            limited to:
          </p>
        </div>

        <div className="call-topics-grid">

          {topics.map((category, index) => {
            const Icon = category.icon;

            return (
              <article className="call-topic-card" key={category.title}>

                <div className="call-topic-card-header">

                  <div className="call-topic-icon">
                    <Icon size={25} />
                  </div>

                  <span className="call-topic-number">
                    0{index + 1}
                  </span>

                </div>

                <h3>{category.title}</h3>

                <div className="call-topic-divider"></div>

                <ul>
                  {category.topics.map((topic) => (
                    <li key={topic}>
                      <CheckCircle2 size={15} />
                      <span>{topic}</span>
                    </li>
                  ))}
                </ul>

              </article>
            );
          })}

        </div>

        {/* SUBMISSION */}


        {/* SUBMISSION PROCESS */}
        <div className="call-process-section">

          <div className="call-process-heading">
            <span>03 / HOW TO PARTICIPATE</span>
            <h3>Research Paper Submission Process</h3>
            <p>
              Follow these four steps to complete your paper submission
              and conference registration.
            </p>
          </div>

          <div className="call-process-grid">

            {steps.map((step) => (
              <article className="call-process-card" key={step.number}>

                <span className="call-process-number">
                  {step.number}
                </span>

                <div className="call-process-indicator"></div>

                <h3>{step.title}</h3>

                <p>{step.description}</p>

              </article>
            ))}

          </div>

        </div>

        {/* POLICY */}
        <div className="call-policy">

          <div className="call-policy-icon">
            <FileText size={23} />
          </div>

          <div>
            <h3>Policy on Dual Submission</h3>

            <p>
              Submissions that are identical or substantially similar
              to versions previously published or under review elsewhere
              are not accepted under the conference dual submission policy.
            </p>
          </div>

        </div>

        {/* FOOTER */}
        <div className="call-papers-footer">
          <span></span>
          <p>RESEARCH · INNOVATION · KNOWLEDGE</p>
          <span></span>
        </div>

      </div>
    </section>
  );
}

export default Papers;
