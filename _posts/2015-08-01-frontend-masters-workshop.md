---
title: "Frontend Masters Angular Components and Node Workshop with Scott Moss"
tags: frontend-masters workshop javascript es6 angular node express api webpack gulp babel
---

I recently had the pleasure of taking a 5-day workshop offered by [Frontend Masters][frontend-masters] ([@FrontendMasters][frontend-masters-twitter]) from July 20th to the 24th. The [first two days][frontend-masters-angular] focused on writing [Angular][angular] applications using a component architecture and [ES2015][es2015]. We spent the [remaining 3 days][frontend-masters-node] building an API with the server-side parts of the MEAN stack ([MongoDB][mongodb], [Express][express], [Node.js][node]).

## What is Frontend Masters?
Frontend Masters is a company out of Minnesota run by CEO Marc Grabanski ([@1Marc][marc-grabanski-twitter]) that offers both online and in-person workshops on various front end topics:

><p>We want you to get opinions and insights from experts who are actively shaping the industry. Leading library and framework creators and those actively participating in moving the web forward.</p>
><p>We want you to learn from expert answers to questions from live, in-person web developers. We capture questions from a classroom of web developers. Some of the best opinions and insights come from web developers who are there in the room with the teachers.</p>
><cite>- ["Introducing Frontend Masters" Blog Post][frontend-masters-blog]</cite>

I hadn't ever attended a workshop with them, and I wasn't originally sure whether I'd even be able to make it to this one. However, at the last minute I realized I could make it work and signed up. Because I was a little late (this workshop started at 9AM CDT and it was already 10AM here on the East Coast when I finally signed up), Marc sent me an email almost immediately making sure that I was squared away and properly situated.

Fortunately, Frontend Masters not only live-streams all of their workshops but also makes them available for playback as online videos almost instantly after every hour-long or so segment. These videos are exactly what you would see if you were watching the livestream and are available for several weeks. Frontend Masters also provides a more formal, edited version of the workshop free of charge for the attendees. Unfortunately, Marc informed us that there had been such a backlog of videos to edit that it might be several months before the edited version of the workshop would be available.

## Attending Online
Teaching the class was Scott Moss ([@scotups][scott-moss-twitter]), former [Hack Reactor][hack-reactor] instructor, founder of [Angular Class][angular-class], and current Senior Frontend Engineer at [Udacity][udacity]. Scott would lecture for anywhere from 20 minutes to an hour and then we'd have a comparably long exercise, or "hacking," session to work on implementing what we'd just been taught. The exercises were actually pretty tough because Scott would purposely throw us curveballs in the exercises. This way we'd have to struggle a little bit and therefore would hopefully better retain what we had learned.

<figure>
    <picture>
        <source
            media="(min-width: 1025px)"
            srcset="../../images/FrontendMastersScott-fullshot_800.webp 1x,
                    ../../images/FrontendMastersScott-fullshot_1600.webp 2x"
            type="image/webp">
        <source
            media="(min-width: 1025px)"
            srcset="../../images/FrontendMastersScott-fullshot_800.jpg 1x,
                    ../../images/FrontendMastersScott-fullshot_1600.jpg 2x">
        <source
            srcset="../../images/FrontendMastersScott-closeup_400.webp 1x,
                    ../../images/FrontendMastersScott-closeup_800.webp 2x"
            type="image/webp">
        <img
            src="../../images/FrontendMastersScott-closeup_400.jpg" alt="Scott Moss at Frontend Masters"
            srcset= "../../images/FrontendMastersScott-closeup_800.jpg 2x">
    </picture>
    <figcaption>Scott Moss lecturing: the livestream included a cool picture-in-picture thing that gave us a high-resolution view of his screen</figcaption>
</figure>

Before I took the class I was a little worried that attending online instead of in-person would lessen the quality of the experience. However, the livestream included a real-time text chat. A Frontend Masters moderator ensured any questions raised were answered to the inquirer's satisfaction, and being able to talk with other attendees without interrupting the instructor was great. Some of the extra details or my minor gaps in knowledge could be addressed by other, helpful attendees without bringing the entire class to a halt. It was also nice to know that I wasn't the only one with any questions!

<figure>
    <picture>
        <source
            media="(min-width: 1025px)"
            srcset="../../images/FrontendMastersClassroom_800.webp 1x,
                    ../../images/FrontendMastersClassroom_1500.webp 2x"
            type="image/webp">
        <source
            media="(min-width: 1025px)"
            srcset="../../images/FrontendMastersClassroom_800.jpg 1x,
                    ../../images/FrontendMastersClassroom_1500.jpg 2x">
        <source
            srcset="../../images/FrontendMastersClassroom_400.webp 1x,
                    ../../images/FrontendMastersClassroom_800.webp 2x,
                    ../../images/FrontendMastersClassroom_1500.webp 3x"
            type="image/webp">
        <img
            src="../../images/FrontendMastersClassroom_400.jpg" alt="My In-Person Classmates"
            srcset= "../../images/FrontendMastersClassroom_800.jpg 2x,
                     ../../images/FrontendMastersClassroom_1500.jpg 3x">
    </picture>
    <figcaption>My In-Person Classmates</figcaption>
</figure>

Even some of the in-person attendees hopped on the chat which helped to narrow any perceived divide between the online group and the in-person group.

## Angular Components
I'm not an expert with Angular (yet!), but considering I was relatively comfortable with the basics I had assumed I'd be able to follow along without much trouble. However, organizing Angular 1.x into a component architecture, something Angular 2.0 will supposedly make simpler, was pretty confusing to me. 

### What is a Component?
First of all, the term *component* can mean different things. Here the term is referring to an architecture pattern in Angular. Rather than having different functionality mixed into the application's views all over the place, each piece of functionality such as displaying a blog post or a user profile has all of its associated code grouped together in one location. While this is encouraged in Angular 1.x for common patterns such as tabs or panes, the idea here is to write code like this for *everything*.

<figure>
    <picture>
        <source
            media="(min-width: 1025px)"
            srcset="../../images/AngularComponents_250.png 1x,
                    ../../images/AngularComponents_490.png 2x">
        <img
            src="../../images/AngularComponents_250.png" alt="Components Folder Structure"
            srcset= "../../images/AngularComponents_490.png 2x">
    </picture>
    <figcaption>Components Folder Structure</figcaption>
</figure>

From my understanding, this encourages a more modular style of writing angular code that reduces dependencies. This makes it easier to both test code as well as extract components for reuse elsewhere. 

Okay, that's not so difficult to understand, right? 

### Modules vs. Angular Modules
Well, it gets more complicated. Because a main reason for writing our applications this way is to make our code more modular and easier to test, we don't want to simply rely on Angular to load all of our modules and dependencies for us. That would require loading the entire application for every test and would mean we would need to bring a large, tangled web of dependencies with us if we ever wanted to reuse the component in another application.

For that reason, we have to use a module loader to explicitly define dependencies at the component level. In this case we used [Webpack][webpack], although Scott advised us that [JSPM][jspm] will soon be the way to go. Scott didn't use it in the workshop because JSPM brings extra complications, especially, so Scott says, the way it loads modules asynchronously. 

Each module explicitly defines its own dependencies to be loaded separately from the Angular module loader. Of course, the main application itself still needs to be wired together using Angular modules, but now we can easily test a module by using Webpack to load only that module's dependencies and test it without having to load the entire application.

### Style Bundling
Scott also showed us a cool Webpack feature whereby we could bundle our styles by requiring them as though they were JavaScript modules. Webpack would then automatically dynamically insert the styles into the page's style tag. I'm not sure if that's a great idea or not&mdash;having everything in a single JS file would presumably mean that even a trivial change in your JS code would bust the entire cache even if nothing about your styles had changed (the reverse would be true as well). I'm also not sure if there would be some sort of site-wide flash of styles the way you can get [FOUT with fonts loaded dynamically][css-tricks-fout].

[_**edit 8/2/2015:** I just recently read that Webpack will only inline your styles this way if the styles are sufficiently small so that the cache-busting drawback wouldn't be a big deal._]

### ES2015
While we were at it, we relied heavily on some new ES2015 features. You've probably heard that ES6 was recently confirmed into spec, so now it's referred to as ES2015. 

Browsers have yet to implement all of what's in the spec, so if you want to use the new syntax now, you will need a transpiler like [Traceur][traceur] or [Babel][babel]. Babel seems to be more popular from my highly subjective point of view and it's what Scott prefers as well. 

Scott's JS knowledge and comfort with the new syntax is pretty unreal. He was constantly showing us 5 different ways to write the same thing, often adding "although, I don't know why you'd want to do that." 

While there are a lot of really awesome features added in ES2015, I'm not totally convinced that every last one is really better, much less actually useful. Destructuring arrays is probably a good example of the less useful (you can try this for yourself online with [Babel's REPL][babel-repl]):

```js
// ES2015
const configValues = ['scot', 'tiger', 'comic sans'];

const {username, password, editorFont} = configValues;
```

Which compiles to this in ES5:

```js
// ES5
'use strict';

var configValues = ['scot', 'tiger', 'comic sans'];

var username = configValues.username;
var password = configValues.password;
var editorFont = configValues.editorFont;
```

That's just asking for trouble if the order of the array elements were to change. Plus, what each value in that array actually represents isn't as clear in the declaration as in some alternative approaches, such as using an object literal to label the values using properties.

That was an example of a new syntax with limited usefulness, but there are also some syntax features that come with "gotchas," such as when passing arguments to the new fat-arrow operator:

```js
const arg1 = "";
const arg2 = "";

const someNoArgsFunction = () => {
  // do something
};

const someOneArgFunction = (arg1) => {
  // do something
};

const someOneArgFunctionAlt = arg1 => {
  // do something
};

const someTwoArgFunction = (arg1, arg2) => {
  // do something
};

const someTwoArgFunctionAlt = arg1, arg2 => {
  // THIS WON'T WORK
}; 
```

And then there's the new shorthand syntax for defining object properties that I find totally confusing. You can mix and match with the old style, which you need to do if you want to also declare inline properties. For example, notice how `template` and `controller` are defined differently than the rest of the properties:

```js
import template from './blog.html';
import {BlogController as controller} from './blog.controller';

export const blogDirective = () => {
  return {
    template,
    controller,
    controllerAs: 'vm',
    scope: {},
    restrict: 'E',
    replace: true
  };
};
```

(That's the native Modules syntax on the first two lines, in case you were wondering.)

### Templating
We finished up the Angular workshop by writing code to use a template to scaffold out a new component. This was a great way to consolidate what we'd learned because it required inferring a pattern from everything we had done over the past two days. It was a nice bonus to experience utilizing a templating engine in Gulp using [gulp-template][gulp-template].

## Node, Express, and MongoDB
On days 3 through 5 we transitioned to back end development with Node and Express. I was more familiar with Node than I was Angular, so I was able to get a better understanding of what was happening.

### MongoDB
Prior to this course, I wasn't very familiar with NoSQL and MongoDB, but learning a NoSQL database was definitely towards the top of my list of things to learn. Scott showed us how to get set up, and I loved the JS-based REPL you can use by typing `mongo` into your shell while an instance of `mongod` is running. 

Pretty much immediately after Scott had us use MongoDB he also had us start using [Mongoose][mongoose]. Mongoose is like an ORM (object relational mapping) framework except that it is used with NoSQL databases and not relational databases, so the "R" gets changed to something like a "D" for object document mapping (since MongoDB is a document store).

Mongoose allows you to define a schema for your models. The way Mongoose defines schemas reminded me of Rails's migrations feature, except that Mongoose works entirely at the application level. Since MongoDB is schema-less, it doesn't care that Mongoose has a schema that it's trying to enforce. That means that unlike Rails's migrations, you don't actually run any migrations because Mongoose is enforcing them at runtime. Every single time you interact with MongoDB, you write your code to do so through Mongoose and therefore ensure that your documents conform to the schema.

#### Application-Level Data Constraints
In Rails we need to be cognizant of the dangers of writing our constraints at the application level. For example, in Rails if we want to ensure an attribute's value unique, it's unwise to rely on a uniqueness validator alone. Instead I would also create a unique index on the attribute in the underlying schema. Otherwise there may be problems such as race conditions when there are many frequent transactions. 

In the stack that Scott showed us, however, now it's not just constraints on attributes but the entire schema that's being handled at the application level. I asked Scott whether there's anything to stop a programmer from forgetting (or being too lazy) to go through Mongoose and circumventing a model's schema, and he told me there wasn't. 

Of course, it's NoSQL, so I guess if you want to have a schema at the database level you'd have to ask yourself why you're not just using an RDBMS in the first place, but then again, couldn't I make the same argument about even using Mongoose at all?

#### SQL vs. NoSQL
That made me think back to [this somewhat well-known article from 2013][nosql-for-production]. I asked Scott about this too, but his answer was that it depended on the data and for what purpose you wanted to use the database. I assumed he meant that if what you're doing is persisting data that is largely unrelated or non-relational in nature, then NoSQL's excellent scalability and performance would make it an attractive choice. 

However, the way I see it, clients' requirements change and expand over time, and who's to say that tomorrow you won't need to add a feature that *does* require relational data? I wish we had gone into this a little deeper&mdash;in fact, I think a discussion on SQL vs. NoSQL should have been the first thing discussed when explaining our database choice. Although, I recognize that it's still a pretty controversial topic and there is probably not one end-all, be-all answer.

## Recap
As the last day drew to a close, I reflected on Scott's teaching style. While some teaching material can suffer from being too abstract or vague, Scott was the opposite. Sometimes I felt like I had learned *how* to do something, but not *why*. I think that may be due to this being more of an introduction than something for developers who were already experts with MongoDB, so it was probably the right way to teach this material.

Each of the exercises was limited in scope so that we would incrementally build up the application, but it was often a little unclear where we were supposed to stop. Sometimes I thought I was done when it turned out I should have gone further, and sometimes I was going crazy trying to figure out why something wasn't working correctly only to learn that it wasn't *supposed* to be working yet. That problem was made worse when Scott sometimes accidentally left functionality and pieces of code meant for later steps sitting in the earlier steps as though we were supposed to use it.

Those two gripes aside, it was a great experience and Frontend Masters definitely found an expert in Scott Moss. By the end of the week we had covered such a vast array of topics that I couldn't even begin to cover all of them here. It was a really intensive 5 days and I got a lot out of the course. 

As a bonus, the workshop tickets came with a free membership for several months that I'm really looking forward to using. You get unlimited access to prior course videos and associated materials. I've already taken Douglas Crockford's JavaScript course which had some great problems.

Overall, I would definitely recommend them if any of the courses sound interesting to you.

[angular-class]: https://angularclass.com/
[angular]: https://angular.io/
[babel-repl]: https://babeljs.io/repl/
[babel]: https://babeljs.io/ 
[css-tricks-fout]: https://css-tricks.com/fout-foit-foft/
[es2015]: http://www.ecma-international.org/ecma-262/6.0/
[express]: http://expressjs.com/
[frontend-masters-blog]: https://frontendmasters.com/introducing-frontend-masters-memberships/?u=84304dedd765b959d054ed4333448d60ad5e6b8e
[frontend-masters-angular]: https://frontendmasters.com/workshops/angular-components-es6/
[frontend-masters-node]: https://frontendmasters.com/workshops/api-design-nodejs/
[frontend-masters-fb]: https://www.facebook.com/FrontendMasters
[frontend-masters-twitter]: https://twitter.com/FrontendMasters
[frontend-masters]: https://frontendmasters.com
[gulp-template]: https://www.npmjs.com/package/gulp-template
[hack-reactor]: http://www.hackreactor.com/
[jspm]: http://jspm.io
[marc-grabanski-twitter]: https://twitter.com/1marc
[mongodb]: https://www.mongodb.org/
[mongoose]: http://mongoosejs.com/
[node]: https://nodejs.org/
[nosql-for-production]: http://www.sarahmei.com/blog/2013/11/11/why-you-should-never-use-mongodb/
[scott-moss-twitter]: https://twitter.com/scotups
[udacity]: https://www.udacity.com/
[webpack]: http://webpack.github.io/
[traceur]: https://github.com/google/traceur-compiler
