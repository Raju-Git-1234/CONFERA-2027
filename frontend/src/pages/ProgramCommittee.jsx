
import './ProgramCommittee.css';

function ProgramCommittee() {
  return (
    <section id="committee" className="program-committee">

      <div className="program-header">
        <span className="program-label">CONFERA 2027</span>
        <h2>Program Committee</h2>
        <div className="program-gold-line"></div>
        <p>Meet the distinguished members of our conference committee.</p>
      </div>

      <div className="program-main-box">

        {/* CHIEF PATRON */}
        <div className="program-group">
          <h3>CHIEF PATRON</h3>
          <div className="program-member-grid single">
            <div className="program-member">
              Mrs. S. TAMILARASI
            </div>
          </div>
        </div>

        {/* PATRONS */}
        <div className="program-group">
          <h3>PATRONS</h3>
          <div className="program-member-grid">
            <div className="program-member">Mrs. G. MALLIGA</div>
            <div className="program-member">Mr. M. MOORTHY</div>
            <div className="program-member">Mrs. GIRJA DEVI</div>
            <div className="program-member">Mrs. VASUKI</div>
          </div>
        </div>

        {/* CONFERENCE CHAIR */}
        <div className="program-group">
          <h3>CONFERENCE CHAIR</h3>
          <div className="program-member-grid single">
            <div className="program-member">
              Dr. K. POORANAPRIYA
            </div>
          </div>
        </div>

        {/* CONVENER */}
        <div className="program-group">
          <h3>CONVENER</h3>
          <div className="program-member-grid single">
            <div className="program-member">
              Dr. K. POORANAPRIYA
            </div>
          </div>
        </div>

        {/* ADVISORY COMMITTEE */}
        <div className="program-group">
          <h3>ADVISORY COMMITTEE</h3>
        </div>

      </div>

    </section>
  );
}

export default ProgramCommittee;
