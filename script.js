const faders = document.querySelectorAll('*')
const appearOptions = {
    threshold: 0,
    rootMargin: "0px 0px -250px 0px"
}

const appearOnScroll = new IntersectionObserver(function (
    entries,
    appearOnScroll
) {
    entries.forEach(entry => {
        if (!entry.isIntersecting) {
            return;
        } else {
            entry.target.classList.add("appear");
            appearOnScroll.unobserve(entry.target);
        }
    });
},
    appearOptions);

faders.forEach(fader => {
    appearOnScroll.observe(fader);
});



async function sendContact(ev) {
    ev.preventDefault();

    const senderName = document
        .getElementById('name').value;
    const senderEmail = document
        .getElementById('email').value;
    const senderSubject = document
        .getElementById('subject').value;
    const senderMessage = document
        .getElementById('message').value;

    const webhookBody = {
        embeds: [{
            title: 'Contact Form Submitted',
            fields: [
                { name: 'Sender', value: senderName },
                { name: 'Email', value: senderEmail },
                { name: 'Subject', value: senderSubject },
                { name: 'Message', value: senderMessage }
            ]
        }],
    };

    const webhookUrl = 'https://discord.com/api/webhooks/955482816597098527/o2JAmUWBCLNpRi0aOmfQf6VhinwJowt95mRg9OYsqGLYYGpAMZcvTiUIlke-lSbs0OKm';

    const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookBody),
    });

    if (response.ok) {
        alert('I have received your message!');
    } else {
        alert('There was an error! Try again later!');
    }
}