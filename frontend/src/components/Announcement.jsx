
import { Megaphone, Sparkles } from 'lucide-react';
import './Announcement.css';

function Announcement() {
  return (
    <section className="confera-announcement">
      <div className="announcement-icon">
        <Megaphone size={22} />
      </div>

      <div className="announcement-heading">
        IMPORTANT
      </div>

      <div className="announcement-divider"></div>

      <div className="announcement-text">
        <div className="announcement-moving-text">
          <Sparkles size={17} />
          <strong>PUBLICATIONS:</strong>
          All registered papers of
          <strong className="gold-text"> CONFERA 2027 </strong>
          will be published in Scopus Indexed Journals
          <span>◆</span>
          Scopus Book Chapters
          <span>◆</span>
          Web of Science
          <span>◆</span>
          SCI
          <span>◆</span>
          ESCI
        </div>
      </div>

      <div className="announcement-year">
        2027
      </div>
    </section>
  );
}

export default Announcement;
