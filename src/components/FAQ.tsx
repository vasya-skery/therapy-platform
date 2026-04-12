'use client'

import { useState } from 'react'
import styles from './FAQ.module.css'

const faqs = [
  {
    question: 'How to formulate a request to a psychologist?',
    answer: 'It can be very difficult to identify the root of a problem on your own. Do not worry — a psychotherapist can help formulate your request. Describe the problem\'s symptomatology: what is bothering you, how it affects your life, and what it might be related to.',
  },
  {
    question: 'What is the difference between a psychologist, psychotherapist and psychiatrist?',
    answer: 'A psychologist has a college degree in Psychology. A psychotherapist has higher education (MA or PhD) plus post-degree experience. A psychiatrist has a medical degree and can prescribe medication. For most people without pronounced mental disorders, an applied psychologist is sufficient.',
  },
  {
    question: 'How can I pay for the session?',
    answer: 'You should make the payment no later than 24 hours before the session using the link in the chat with a specialist. Payment can also be made from foreign banks.',
  },
  {
    question: 'How much does a psychotherapy cost?',
    answer: 'On our platform, there are specialists with prices ranging from $20 to $100 for a 50-minute session. The price depends on the therapist\'s qualifications and experience.',
  },
  {
    question: 'What can I expect in the first session?',
    answer: 'The first session is an introductory meeting. Your specialist will ask about what brought you to therapy and ask questions about various life events. The duration is usually 50 minutes.',
  },
  {
    question: 'Is everything I say in the session confidential?',
    answer: 'Yes, the communication between you and the specialist takes place directly between you two, without any involvement on our part. Everything that happens during the session is completely confidential.',
  },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>Questions & answers</h2>
        
        <div className={styles.faqs}>
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`${styles.faq} ${openIndex === index ? styles.open : ''}`}
            >
              <button 
                className={styles.question}
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                {faq.question}
                <span className={styles.icon}>{openIndex === index ? '−' : '+'}</span>
              </button>
              <div className={styles.answer}>
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
