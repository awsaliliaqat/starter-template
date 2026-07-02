# My Course App 🚀

This is your very own web app for the course. You'll edit the files here, run it
on your own computer, and deploy it to the internet just by pushing to GitHub.

**You don't need to understand every file.** You'll mostly work in the
`public/` folder.

## What's in here

```
public/
  index.html   ← the content of your page (edit this first!)
  styles.css   ← the colors, fonts, and spacing
  script.js    ← makes the page interactive (the button)
server.js      ← runs your site (you don't need to edit this)
package.json   ← project settings
```

## Run it on your computer

1. Open this project in the Claude desktop app.
2. In the terminal, install and start it:
   ```bash
   npm install
   npm run dev
   ```
3. Open **http://localhost:3000** in your browser. That's your app! 🎉
4. Edit something in `public/index.html`, save, and refresh the page to see it
   change. If you get stuck, just ask Claude.

## Put it online (deploy)

Deploying is just three steps — you save your changes, then push them:

```bash
git add .
git commit -m "My first change"
git push
```

That's it! Pushing automatically deploys your app. Head back to your **course
dashboard** and watch the deploy status change to "Live ✓" — then click your
live link to see your app on the real internet. Share it with a friend!

## Ideas to try

- Change the heading and the colors in `styles.css`.
- Add a photo: put an image in `public/` and use
  `<img src="my-photo.jpg" alt="me" />` in `index.html`.
- Add another button and make it do something in `script.js`.

Have fun — you're building real things now. 💪
