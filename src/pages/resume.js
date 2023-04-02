import React from "react";
// import "./resume.css";

export default function Resume() {
  return (
    <div>
      <section className="jumbotron text-center">
        <div className="container">
          <h1>Hello, World!</h1>
          <p className="lead text-muted">I'm a full-stack web developer.</p>
        </div>
      </section>

      <section className="py-5 bg-secondary">
        <div className="container">
          <div id="code">
            <div id="console">
              &gt; Ala.location
              <br />
              <span className="answer">
                &nbsp;&nbsp;=&gt; "Sacramento, CA"
                <br />
                <br />
              </span>
              &gt; Ala.education
              <br />
              <span className="answer">
                &nbsp;&nbsp;=&gt; "University of California, San Diego"
                <br />
                <br />
              </span>
              &gt; Ala.major
              <br />
              <span className="answer">
                &nbsp;&nbsp;=&gt; "Computer Science"
                <br />
                <br />
              </span>
              &gt; Ala.graduationDate
              <br />
              <span className="answer">
                &nbsp;&nbsp;=&gt; "December 2011"
                <br />
                <br />
              </span>
              &gt; Ala.interests
              <br />
              <span className="answer">
                &nbsp;&nbsp;=&gt; ["code", "music", "synthesizers", "coffee",
                "climbing", "traveling", "fans"]
                <br />
                <br />
              </span>
              &gt; Ala.workExperience.latest
              <br />
              <span className="answer">
                &nbsp;&nbsp;=&gt; Latest Work Experience
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; company: "ADM
                Associates, Inc."
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; role: "IT Engineer"
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; startDate: "March,
                2012"
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; endDate: "Current,
                2020"
                <br />
                <br />
              </span>
              &gt; Ala.resume
              <br />
              <span className="answer">
                &nbsp;&nbsp;=&gt; "
                <a target="_blank" href="alaarab.pdf">
                  alaarab.pdf
                </a>
                "<br />
                <br />
              </span>
              &gt; Ala.email
              <br />
              <span className="answer">
                &nbsp;&nbsp;=&gt; "
                <a target="_blank" href="mailto:alaarab@gmail.com">
                  alaarab@gmail.com
                </a>
                "<br />
                <br />
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5 bg-light">
        <div className="container">
          <h4 className="text-center py-3">Résumé</h4>

          <div className="education py-3">
            <h6 className="border-bottom border-gray pb-2 mb-2">Education</h6>
            <div className="row pb-3">
              <div className="col-md-9">
                <b>University of California, San Diego</b>
                <br />
                Computer Science, B.S.
              </div>
              <div className="col-md-3">
                2008-2011
                <br />
                San Diego, CA
              </div>
            </div>
            <div className="row pb-3">
              <div className="col-md-9">
                <b>University of California, Santa Cruz</b>
                <br />
                Computer Science and Engineering
              </div>
              <div className="col-md-3">
                2006-2008
                <br />
                Santa Cruz, CA
              </div>
            </div>
            <div>
              Relevant Coursework:
              <ul>
                <li>Object-Oriented Programming</li>
                <li>Data Structures and Object-Oriented Design</li>
                <li>Computer Systems and Assembly Language</li>
                <li>Algorithms and Abstract Data Types</li>
                <li>Discrete Mathematics</li>
                <li>Systems Programming</li>
                <li>Advanced Data Structures</li>
                <li>Design and Analysis of Algorithms</li>
                <li>Software Engineering</li>
                <li>Theory of Computability</li>
                <li>Programming Languages: Principles and Paradigms</li>
                <li>Database System Principles</li>
                <li>Online Database Analytics Applications</li>
                <li>Computer Architecture</li>
              </ul>
            </div>
          </div>

          <div className="experience py-3">
            <h6 className="border-bottom border-gray pb-2 mb-2">
              Work Experience
            </h6>
            <div className="job">
              <div className="row pb-3">
                <div className="col-md-9">
                  <b>ADM Associates, Inc.</b>
                  <br />
                  Software Engineer
                </div>
                <div className="col-md-3">
                  2012-2020
                  <br />
                  Sacramento, CA
                </div>
              </div>
              <div>
                <p>
                  Working directly with engineers, stakeholders, and clients to
                  design, create, and maintain web applications for internal and
                  client use. Additionally managing databases and servers for
                  use by engineers, analysts, and data scientists with SOC2 type
                  II compliance.
                </p>
              </div>
            </div>
            <div className="job">
              <div className="row pb-3">
                <div className="col-md-9">
                  <b>Greater Sacramento Pediatrics Association</b>
                  <br />
                  IT Consultant
                </div>
                <div className="col-md-3">
                  2019
                  <br />
                  Sacramento, CA
                </div>
              </div>
              <div>
                <p>
                  Proposing and implementing system enhancements while
                  documenting existing and new processes for IT support teams.
                  Migrated domain and e-mails to Office365. Managing servers in
                  a VMWare environment.
                </p>
              </div>
            </div>
            <div className="job">
              <div className="row pb-3">
                <div className="col-md-9">
                  <b>Matrix Energy Services, Inc.</b>
                  <br />
                  IT Engineer
                </div>
                <div className="col-md-3">
                  2012-2013
                  <br />
                  Sacramento, CA
                </div>
              </div>
              <div>
                <p>
                  Working closely with project managers to lead web application
                  development for Retrofit Program in Maryland. Created
                  Applications for migrating data between systems/databases
                  using iPad Applications, Ruby on Rails, and Excel. Designed
                  and executed test procedures. Redeveloped company website.
                </p>
              </div>
            </div>
            <div className="job">
              <div className="row pb-3">
                <div className="col-md-9">
                  <b>UCSD TIES - Town and Country Learning Center</b>
                  <br />
                  Computer Science - Developer
                </div>
                <div className="col-md-3">
                  2011
                  <br />
                  San Diego, CA
                </div>
              </div>
              <div>
                <p>
                  Designed and implemented webpage for Garden Sensor Network
                  which used incoming data from sensors through JSON to help the
                  Learning Center decide how to take care of its plants
                  depending on light, temperature, and moisture values. Extended
                  features in UCSD Music Video Game written in Processing.
                  Collaborated with other engineers in computer science,
                  electrical, and mechanical engineering to bring inventive
                  ideas to the learning center.
                </p>
              </div>
            </div>
            <div className="job">
              <div className="row pb-3">
                <div className="col-md-9">
                  <b>Dell</b>
                  <br />
                  Marketing, Advertising, and Technical Support
                </div>
                <div className="col-md-3">
                  2008-2009
                  <br />
                  Santa Cruz, CA
                </div>
              </div>
              <div>
                <p>
                  Providing technical support to students and parents to help
                  them gain knowledge of Dell's product line with a goal to
                  sell. Came up with ideas and strategies to help market for
                  Dell on-campus with a partner.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
