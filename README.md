# AO3-Tone-Marks

This is based on GodofLaundryBaskets <a href="https://godoflaundrybaskets.dreamwidth.org/3315.html">Google Docs Tone Mark Script.</a> It will display the tone marks over the supported chinese names, and if the audio is available allow you to click on that name and listen to the audio guide for that name recorded by <a href="https://lunatique.dreamwidth.org/221218.html">lunatique</a> directly on the AO3 page.

## Installation
You need to have tampermonkey/greasemonkey installed and then you just need to click <a href="https://github.com/Cathalinaheart/AO3-Tone-Marks/raw/main/Tone%20Marks.pub.user.js">here</a> to install/update it.

On first use (or after an upgrade) you will be notified that a userscript wants to use a foreign ressource, you can confirm this for always. The file it wants to load is https://github.com/Cathalinaheart/AO3-Tone-Marks/raw/main/playaudio.min.js, which is necessary to be able to play the audio guide clips.

## Supported Fandoms
##### Tone Marks
MDZS, TGCF, Guardian, NiF, Word of Honor, King's Avatar.

More are in progress.

##### Pronunciation Guide on Page
MDZS

Audio guide support is currently in progress. Not every word has audio at this point that can be linked.

## Contributing
If you would like to help contribute tone marks for fandoms that are not yet supported, you can do that in the google sheet <a href="https://docs.google.com/spreadsheets/d/1cfmiVdMwXTU4EgG45kow9MKWMOSwmiShX5iO50bmwmU/edit?usp=sharing">here</a>

## Issues
If you spot an issue like missing tone marks, please let me know either by submitting an issue here or reaching out to me on twitter/tumblr @cathalinaheart or via email cathalinaheart {at} gmail.com.

## Other
###### Underline Replacements
If you'd like to see the replacements underlined, you can add the following to your ao3 site skin:
```css
.replacement {
  text-decoration: underline;
}
```
######  Hide the speaker symbol
If you would like to hide the speaker symbol with a work skin, you can add the following to your ao3 site skin:
```css
.audio-guide {
  display: none;
}
```
You can still play the audio by directly clicking on the name.

###### The fandom.txt file format
For each line 'some text here|fancy replacement', the script replaces all
instances of 'some text here' in the doc with 'fancy replacement'.

 * capitalization on the left side is ignored
 * any spaces on the left side that are between words will match things
 with (a) no space there (b) a dash there or (c) a space there. Examples:
   - The line 'hanguang jun|Hánguāng-jūn' will cause the script to replace
     any of 'hanguang jun', 'hanguangjun', or 'hanguang-jun' with 
     'Hánguāng-jūn'
   - The line 'wen ke xing|Wēn Kèxíng' will cause the script to replace 
     any of 'Wen KeXing','Wen Ke Xing', and 'wen kexing' with 'Wēn Kèxíng'
 * any spaces on the left or right that are before all words or after all
 words will be ignored
 * partial-word matches will be ignored (e.g., if 'lan' is part of 'plan'
 or 'land' it will not be replaced; if 'lan sect' is part of 'plan section'
 it will not be replaced)
 * lines with only spaces on them, or that start with #, will be ignored.
 * If an audio clip is available it can be added to the file like so: "some text|replacement|direct_audio_url"
