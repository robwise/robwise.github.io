---
title: Is Programming a Unique Discipline?
tags:
  - opinion
  - general programming
published: True
---

Are the peculiarities of programming (I'm just going to call it "programming" for simplicity, but you can take this to mean web development, software engineering, mobile app development, scripting, and so on) really due to it being a unique discipline? Are the constantly evolving standards and technologies, wild variabilities in quality, seemingly endless new startups, and global expansion of influence all unavoidable characteristics of the industry? Please don't take the following as me trying to answer these questions definitively or even as me taking a certain stance on the issue. I am merely thinking out loud here.

## Industrial Revolution vs. Information Revolution and Other Deep Thoughts from a Shallow Mind
Sometimes when I'm sitting around thinking about things, I contemplate whether there are any parallels between the First and Second Industrial Revolutions and the Information Revolution (sorry, I know that's a cheesy buzzword). On occasion, I've watched the television program [*How Do They Do It?*][how-do-they-do-it]. Perhaps you have seen it or a similar program depicting how various things are manufactured. Admittedly, I can only stand a couple of minutes before I fall asleep from boredom&mdash;it's sort of like watching a 4-minute mile or a record [keg stand][keg-stand]: impressive but not actually *that* exciting to watch.

However, it strikes me that many of these manufacturing processes are highly complex and also probably unique to that one company. To successfully design and implement these processes, one would need to know: how many of something would be produced in a given period of time, which items would need quality checking and at what point of the process, what level of quality would be acceptable and what would not, how the output of each step of the process would be input for another, and so on. I can see many parallels to programming here.

I recently had to get several ultrasounds done at the hospital. I suppose many people would have been preoccupied with what the image looked like or perhaps how much it hurt to have the instrument jabbed deep into their abdomen (a technique that is not usually necessary, but I'm a rather big boy so there is a lot of "cushion" that gets in the way).

Instead, I was fascinated by the machine's user experience. I had multiple ultrasounds done by different technicians, and each time the technician was switching modes, taking pictures, and navigating around with complete ease and efficiency and without needing to look at any of the buttons.

This machine happened to be made by General Electric (I was so impressed that I made sure to find out). While there was a software component to the machine for sure, they had also perfectly integrated complex hardware with an elegant keypad interface, all to perform a very specialized task with serious consequences for getting things wrong. Someone at GE did some serious requirements gathering and UX testing (which I'm sure must have taken several attempts to get it right).

## Don't Arrest Me, Bro
So, whether it's the manufacturing process or the ultrasound machine, who figured out all of that? Engineers did.

Some believe that it's incorrect, disingenuous, or even [illegal][engineer-illegal] for developers to refer to themselves as "software engineers." Because there is ambiguity and a creative aspect to programming, they say, programming is different than engineering. In response to the ambiguity argument, remember that whether the task is engineering a manufacturing process, a medical device, an aircraft, a building, a bridge, or even a circuit board, there is no one best way to do it (although some designs and implementations are better than others). As for the creativity aspect, aesthetics are often an important criteria in engineering, and I think most engineers would be insulted to be told that their industry didn't require creativity.

## Why Engineering and Programming are Different...for now...or maybe not...
Why, then, do engineers get it right while programmers get it wrong? One answer is: they don't! Traditional engineering projects can still get it wrong for the same reasons that developers get it wrong: missing deadlines, going over budget, mis-communicating requirements, etc. Calling something engineering doesn't preclude these types of problems.

Of course, the failure rates in programming [are generally much higher than those of traditional engineering disciplines][failure-rates]. But, is that because programming is incompatible with engineering, or rather that programming hasn't had as much time to evolve? The Second Industrial Revolution began in the mid-1800s, but Ford didn't invent the assembly line until 1913. It has since been over a hundred years, and companies seeking ever-greater efficiencies and profits have studied, refined, and improved upon these techniques. Engineering marvels like the [Large Hadron Collider][large-hadron-collider] are today's reality.

I don't think developers have reached this level of maturity in the industry yet, although there are plenty of examples of progress and evolution. We've explored the different paradigms of procedural versus object-oriented versus functional programming. We've identified  ways to make code more readable and maintainable. We've explored the efficacy of large, upfront requirements-gathering processes ([Waterfall][waterfall]) versus flexible, continuous-requirements approaches ([Agile][agile]). In fact, Agile, which most people associate with the information systems sector, may owe some of its origins to traditional engineering disciplines and can be just as [useful in those contexts][agile-car-development].

## More Deep Thoughts
Will programming in the future ever become just another traditional engineering discipline? Will the rate of rapid advances and paradigm shifts slow down? Certainly the current rate of advances in the web development world, especially when it comes to the myriad of new JavaScript libraries and frameworks, seems to be, if anything, *speeding up*.

However, I was inspired to write this article after reading one of Avdi Grimm's blog posts entitled ["Programming in a Mad Max Wasteland"][avdi-mad-max] that takes a higher-level perspective. Avdi argues that the majority of new programming languages today are actually refinements or cobbled-together reuses of older languages&mdash;something he compares to the characters of the [Mad Max movies][mad-max] and their reliance on salvaging cars and other resources from a more productive era.

I think Avdi was clearly lamenting this trend (whether you enjoyed the Mad Max movies or not), but perhaps it could be interpreted as a sign that the field is maturing&mdash;that we are refining and honing in on the better ways to do things.

[keg-stand]: https://en.wikipedia.org/wiki/Keg_stand
[avdi-mad-max]: http://devblog.avdi.org/2015/10/11/programming-in-a-mad-max-wasteland/
[engineer-illegal]: https://twitter.com/peter_nitsch/status/578915651894403072
[agile-car-development]: http://www.forbes.com/sites/stevedenning/2012/05/10/wikispeed-how-a-100-mpg-car-was-developed-in-3-months/
[failure-rates]: http://maxwideman.com/guests/failure_rates/intro.htm
[how-do-they-do-it]: http://www.sciencechannel.com/tv-shows/how-do-they-do-it/
[large-hadron-collider]: https://en.wikipedia.org/wiki/Large_Hadron_Collider
[agile]: http://www.agilemanifesto.org/
[waterfall]: https://en.wikipedia.org/wiki/Waterfall_model
[mad-max]: https://en.wikipedia.org/wiki/Mad_Max
