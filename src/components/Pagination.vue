<template> 
     <div class="bottom-5 mt-auto mb-4 w-full">
        <nav class="pagination is-centered" role="navigation" aria-label="pagination">
            <ul class="pagination-list" >

                <li v-for="page in pages" :key="page">
                    <template v-if="page == 1 || page == pages || (page == currentPage || page == currentPage+1 || page == currentPage-1)">
                    <a class="pagination-link bg-gray-300" :class="currentPage == page ? '! is-current' : ''"   @click="$emit('onPageChange', { page: page })">{{ page }}</a>
                </template>
                <template v-else-if="page == currentPage-2 || page == currentPage+2">
                        <li><span class="pagination-ellipsis font-bold">&hellip;</span></li>
                    </template>
                </li>
        </ul>
</nav>
    </div>
</template>
<script>
export default {
    name: 'Pagination',
    props: {
        pages: { type: Number, default: 1, required: true },
        currentPage: { type: Number, default: 1, required: true }
    }
}
</script>