---
aside: false
---
# Share data between forms
Sometimes, you may need to share form data across different pages, views, or components. For example, you might have a simple filter on the homepage and a more advanced filter in a sidebar that can be toggled.

In these scenarios, sharing data between forms ensures that changes in one form are automatically reflected in the other. This approach keeps your forms in sync and improves the user and developer experience.

<script setup>
import SharedForm from '../../../components/examples/SharedForm/SharedForm.vue?raw';
import SideBar from '../../../components/examples/SharedForm/SideBar.vue?raw';
</script>
<Editor height="500px" :files="{'App.vue': SharedForm, 'SideBar.vue': SideBar}" />
<!-- <iframe src="https://play.vuejs.org/#eNq9V+Fu2zYQfhVOxWYHsCWnTrZVU4y0aVKsQNuh3ro/AgZaOtlsKFIgKceZkXffkZQceUsde8uKIBB5/I68O/LuO6+Dl1UVLmsI4iDRmWKVIRpMXRFOxfwsDYxOg0kqWFlJZciaKCjIHSmULEkP1Xo/ddZqDVdSld31YYECVtx2cFOWwyuqGkwYNXNrhEWlwtxWQH7ToF5TQ8kZWaeCkIwqHRNtFBNzRKFAcqm2JEUN/A+r3JHe2Q0zKTS6tZA39qwZnn1m/egXlGs4QpQHrIm1fkCuGPB8QBZU5Bym9axkZkCWlNeg0bWz1s2kNXHSdxYKWuLJvYJxA6o3sKJKAWKWKDaqBidighlG+Se3Xex9a73rLSVfyp4Vod131rKN8c4MPLxrVb+f4/FH5Gzi96EclOm/nX54H/oAYOAdZEBqkUPBBKBfvTQ1vaOj5oAk8reOd4wTA2XFqQGcEZLkbEkyTrXGd6AA5WwJ7jVYk5P2HpfDUubAEdOJcBqQqAV2t0FvDEU78PpdnDbbIc69nXPvqd3NDToAhHA6Az65oCqJ/LCz5q7N3YI9BwOKNrTH2lc4tGcryVFMrUwDh2x7f9xFVoZJ4a8bQe5GEPPJfpPIr+7U0JTOUGGKn73wJagMcrBp9q4Z7qVH65yhzkv8PIBPIheOB2Jn0+bR6FnQU4RPQY6Ij5Dv5dJcAQjEv7HfvTRuFszYJ/m7/e4XhlltDO7QujYzguD/sFKspOqWlGY4xg2v3OtMIo8+UJ+Uevgc42RrkYU4DZyfZ5xl19uJgin9zVbeTKY4I7qZdnz3CfOQSVhmNvY09q/Xm4p1l0QIuE+zyOZZm5sRJqdP9maURJ0akGhzy+3gvKndvYUxlY6jKMtF+Flj2rOlCgWYSFRlNJPSYOGh1flpOA6/xx21iTKt7xfCkokQJbbQxwqlvnB9Fy+o7oeN00dtVQy9y+20DUFMZrxW/dNqZQuYlWO19CUzFVs6eKTQWG+liBtdMgqfn2pPDGH3WXuFkq6GNyw3i5iMR6Nq5YFYI5s4BAMkRNQo2BzdlwJZ0+nZlCkrhvX3g3uCmM2b2o6pyrm8eetkGx5wOgvIrh+Qf9YrK0uDXxr+SIPNmqFqDph2dvly+h5WON4sYiGuOaJ3LH4ELXltbfSwV8gMaHYH56z92d03Usiv+nJlAKPYOGUNddF2eCyQNVzscP3e3HF40t4SRtG/p2GJT2I7jn5he5NOH+GN3vkKO+jz5+EoPD72D7EjD0GjXhp0DOp0Ifu2Qo+0O/ddB+a4Z993ligTzAYOVEz6nuD/p3bnK3QzBzUQbUULsGFgRVME77uJTlHaxfNPwfKHcvxhDP/v+P0Qdv87qe1i9ifh9UNY/VBOP4zRv+D6FaaCY9vd7m8y5r+HYE7thb6h+9xlzjBvcPPJazfYQ8Odr1iGOpfN8PFQPFVjgjXB/TDCwy+41PDPXuQLncghfUinC9ndebRNgS+LFc1zrHQxOVZQuipYyZbg6cwxGzjxn0OGv3hWMXnxws0Vmy9MTEZusgA/Ox6NvnWChvJPGsonZEaz67mSyI34NlzhfVYUhV+Sq6Fe0Fze4Hb4Nz6pVmSM/89+/MH+bbcMwd1f4JMQTw==" /> -->
