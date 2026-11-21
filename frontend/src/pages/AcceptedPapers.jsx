
import { useState } from 'react';
import './AcceptedPapers.css';

import {
  Search,
  FileText,
  BookOpen,
  Award,
  CheckCircle2
} from 'lucide-react';

function AcceptedPapers() {
  const [searchTerm, setSearchTerm] = useState('');

  // Accepted papers will be loaded from the backend later.
  const acceptedPapers = [];

  const filteredPapers = acceptedPapers.filter((paper) =>
    `${paper.title} ${paper.author} ${paper.paperId}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <section
  id="accepted-papers"
  className="accepted-papers-section"
>
      <div className="accepted-papers-container">

        <div className="accepted-papers-heading">
          <span className="accepted-papers-tag">
            CONFERA 2027
          </span>

          <h1>
            Accepted <span>Papers</span>
          </h1>

          <p>
            Explore the research papers accepted for presentation
            at the CONFERA 2027 International Conference.
          </p>
        </div>

        <div className="accepted-papers-info">
          <div className="accepted-info-icon">
            <Award size={28} />
          </div>

          <div>
            <h3>Research Excellence</h3>
            <p>
              Discover innovative research and contributions
              accepted by our conference review committee.
            </p>
          </div>
        </div>

        <div className="accepted-papers-toolbar">
          <div>
            <h2>Accepted Research Papers</h2>
            <p>Search the list of accepted submissions.</p>
          </div>

          <div className="accepted-search-box">
            <Search size={19} />

            <input
              type="text"
              placeholder="Search by title, author or paper ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="accepted-papers-list">

          {filteredPapers.length > 0 ? (
            filteredPapers.map((paper) => (
              <div className="accepted-paper-card" key={paper.paperId}>
                <div className="accepted-paper-icon">
                  <FileText size={25} />
                </div>

                <div className="accepted-paper-details">
                  <span>{paper.paperId}</span>
                  <h3>{paper.title}</h3>
                  <p>
                    {paper.author} | {paper.institution}
                  </p>
                </div>

                <div className="accepted-status">
                  <CheckCircle2 size={17} />
                  Accepted
                </div>
              </div>
            ))
          ) : (
            <div className="accepted-empty-state">
              <div className="accepted-empty-icon">
                <BookOpen size={35} />
              </div>

              <h3>
                {searchTerm
                  ? 'No Matching Papers Found'
                  : 'Accepted Papers Will Be Announced Soon'}
              </h3>

              <p>
                {searchTerm
                  ? 'Try searching with another paper title, author name or paper ID.'
                  : 'The list of officially accepted research papers will be published here after the review process.'}
              </p>
            </div>
          )}

        </div>

        <div className="accepted-papers-footer">
          <span>CONFERA 2027</span>
          <p>Advancing Research. Inspiring Innovation.</p>
        </div>

      </div>
    </section>
  );
}

export default AcceptedPapers;
