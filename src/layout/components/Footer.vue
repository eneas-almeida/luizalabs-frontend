<template>
    <footer class="footer">
        <span
            >Copyright <strong>{{ nameApp }}</strong> © 2025</span
        >
    </footer>
</template>

<script>
    export default {
        name: 'Footer',
        props: {
            nameApp: String
        }
    };
</script>

<style>
    .footer {
        grid-area: footer;
        background-color: #d0d0d0;
        font-size: 11px;
        color: #333;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        padding-right: 10px;
    }
</style>
