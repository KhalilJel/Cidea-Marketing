import React, { useRef, useState } from "react";
import { contactPage, services, site } from "../content.js";
import { Arrow } from "../components/Layout.jsx";
import { Spark } from "../components/Blocks.jsx";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// The form does not post anywhere. It validates the enquiry and opens the
// visitor's own email app with the message filled in (mailto:).
function ContactForm({ lang }) {
  const c = contactPage[lang];
  const [values, setValues] = useState({ name: "", email: "", company: "", website: "", message: "", interests: [] });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);
  const summaryRef = useRef(null);

  const set = (field) => (e) => setValues({ ...values, [field]: e.target.value });
  const toggle = (name) => setValues({ ...values, interests: values.interests.includes(name) ? values.interests.filter((x) => x !== name) : [...values.interests, name] });

  function validate() {
    const next = {};
    if (!values.name.trim()) next.name = c.errors.name;
    if (!EMAIL.test(values.email.trim())) next.email = c.errors.email;
    if (values.message.trim().length < 10) next.message = c.errors.message;
    return next;
  }

  function onSubmit(e) {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length) {
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    const details = [
      [c.name, values.name],
      [c.email, values.email],
      [c.company, values.company],
      [c.website, values.website],
      [c.interestLabel, values.interests.join(", ")],
    ]
      .filter(([, value]) => value.trim())
      .map(([label, value]) => `${label}: ${value.trim()}`);
    const body = [...details, "", values.message.trim()].join("\n");
    const href = `mailto:${site.email}?subject=${encodeURIComponent(c.subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
    window.location.href = href;
  }

  if (sent)
    return (
      <div className="formSuccess" role="status">
        <Spark />
        <h2>{c.successTitle}</h2>
        <p className="body">
          {c.successBody} <a href={`mailto:${site.email}`}>{site.email}</a>.
        </p>
        <button type="button" className="ghost" onClick={() => setSent(false)}>
          {c.reset} <Arrow />
        </button>
      </div>
    );

  const errorList = Object.entries(errors);
  const field = (name, label, props = {}, optional = false) => (
    <div className={"field" + (errors[name] ? " hasError" : "")}>
      <label htmlFor={`f-${name}`}>
        {label} {optional && <span className="optional">({c.optional})</span>}
      </label>
      <input
        id={`f-${name}`}
        name={name}
        value={values[name]}
        onChange={set(name)}
        aria-invalid={errors[name] ? "true" : undefined}
        aria-describedby={errors[name] ? `e-${name}` : undefined}
        {...props}
      />
      {errors[name] && (
        <p className="fieldError" id={`e-${name}`}>
          {errors[name]}
        </p>
      )}
    </div>
  );

  return (
    <form className="contactForm" onSubmit={onSubmit} noValidate>
      {errorList.length > 0 && (
        <div className="errorSummary" role="alert" tabIndex={-1} ref={summaryRef}>
          <p>{c.errorSummary}</p>
          <ul>
            {errorList.map(([k, msg]) => (
              <li key={k}>
                <a href={`#f-${k}`}>{msg}</a>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="fieldRow">
        {field("name", c.name, { autoComplete: "name", required: true })}
        {field("email", c.email, { type: "email", autoComplete: "email", required: true, inputMode: "email" })}
      </div>
      <div className="fieldRow">
        {field("company", c.company, { autoComplete: "organization" }, true)}
        {field("website", c.website, { type: "url", autoComplete: "url", placeholder: "https://" }, true)}
      </div>
      <fieldset className="chips">
        <legend>{c.interest}</legend>
        {services.map((s) => {
          const name = s[lang].name;
          return (
            <label key={s.key} className="chip">
              <input type="checkbox" checked={values.interests.includes(name)} onChange={() => toggle(name)} />
              <span>{name}</span>
            </label>
          );
        })}
      </fieldset>
      <div className={"field" + (errors.message ? " hasError" : "")}>
        <label htmlFor="f-message">{c.message}</label>
        <p className="hint" id="h-message">
          {c.messageHint}
        </p>
        <textarea
          id="f-message"
          name="message"
          rows={6}
          value={values.message}
          onChange={set("message")}
          aria-invalid={errors.message ? "true" : undefined}
          aria-describedby={"h-message" + (errors.message ? " e-message" : "")}
          required
        />
        {errors.message && (
          <p className="fieldError" id="e-message">
            {errors.message}
          </p>
        )}
      </div>
      <div className="formFoot">
        <button className="button primary" type="submit">
          {c.submit} <Arrow />
        </button>
        <p className="fineprint">{c.helper}</p>
      </div>
    </form>
  );
}

export function Contact({ lang }) {
  const c = contactPage[lang];
  return (
    <section className="pageHero contactPage" aria-labelledby="page-title">
      <div className="wrap contactGrid">
        <div className="contactIntro">
          <p className="eyebrow">{c.eyebrow}</p>
          <h1 id="page-title" className="display small">
            {c.title}
          </h1>
          <p className="lead">{c.lead}</p>
          <div className="nextSteps">
            <h2 className="label">{c.nextTitle}</h2>
            <ol>
              {c.next.map(([strong, rest], i) => (
                <li key={strong}>
                  <span className="stepNo" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p>
                    <strong>{strong}</strong> {rest}
                  </p>
                </li>
              ))}
            </ol>
          </div>
          <div className="direct">
            <h2 className="label">{c.directTitle}</h2>
            <a className="directMail" href={`mailto:${site.email}`}>
              {site.email}
            </a>
          </div>
        </div>
        <ContactForm lang={lang} />
      </div>
    </section>
  );
}
