import { Link } from "react-router-dom";

const Faq = () => {
  return (
    <div className="faq-page page-card">
      <div>
        <h2>FAQ</h2>
        <div>Not sure what Uoft Commuter Hub is? Start here. </div>
      </div>
      <div>
        <h4>What is UofT Commuter Hub?</h4>
        <div>
          UofT Commuter Hub is a platform that helps UofT students find a
          commute buddy for their daily commute.
        </div>
      </div>
      <div>
        <h4>What is a commute buddy?</h4>
        <div>
          A commute buddy is someone you're paired with who shares a similar
          commute to and/or from campus.
        </div>
      </div>
      <div>
        <h4>How do I find a match?</h4>
        <div>
          UofT Commuter Hub uses your travel details (see{" "}
          <Link to="/manage-commutes">My Commutes</Link>) to find a match. You can
          also search for matches using the <Link to="/matching">Matching</Link>{" "}
          page.
        </div>
      </div>
      <div>
        <h4>Do I need a car to participate?</h4>
        <div>
          You don't need a car to participate! UofT Commuter Hub supports all
          forms of commuting, including walking, biking, transit, and
          carpooling.
        </div>
      </div>

      <div>
        Have more questions?{" "}
        <a href="mailto:uoftcommuterhub@gmail.com">Contact us</a>.
      </div>
    </div>
  );
};

export default Faq;
