<template>
  <div
    class="bg-brand-dark text-white font-sans overflow-x-hidden selection:bg-brand-purple selection:text-white relative"
  >
    <!-- Vector Background -->
    <div class="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <div
        class="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-100 mix-blend-normal transform scale-105"
        :style="{ backgroundImage: `url(${vectorBg})` }"
      ></div>
      <div
        class="absolute inset-0 bg-gradient-to-b from-[#030014]/90 via-[#030014]/60 to-[#030014]/90"
      ></div>
      <div class="absolute inset-0 bg-black/10 backdrop-blur-[0px]"></div>
    </div>

    <!-- Content Wrapper -->
    <div class="relative z-10">
      <!-- New 3D Carousel Hero -->
      <HeroCarousel3D
        :products="products.slice(0, 8)"
        @add-to-cart="addToCart"
        @view-details="viewProductDetails"
      />

      <!-- Brand Bar (Marquee) -->
      <section class="bg-black py-8 border-y border-white/5 relative z-20 overflow-hidden">
        <div class="marquee-container flex whitespace-nowrap overflow-hidden relative w-full">
          <!-- Marquee Content (Duplicated for seamless loop) -->
          <div class="marquee-track flex gap-24 items-center animate-marquee pl-24">
            <span
              v-for="brand in ['OneOdio', 'Maono', 'Fifine', 'Jeecoo', 'Nubwo', 'OneOdio']"
              :key="brand"
              class="animate__animated animate__bounce inline-block text-3xl font-bold font-heading text-white/50 tracking-widest uppercase hover:text-white transition-colors duration-300 cursor-default"
            >
              {{ brand }}
            </span>
          </div>
        </div>
      </section>

      <!-- Experiences Section -->
      <section class="py-12 lg:py-24 relative z-10 overflow-hidden reveal-on-scroll">
        <div class="container mx-auto px-6 max-w-7xl">
          <div class="flex flex-col lg:flex-row items-center gap-16">
            <!-- Text Content (Left) -->
            <div class="w-full lg:w-1/3 space-y-8 relative z-20">
              <span class="text-brand-pink font-bold tracking-[0.2em] text-sm uppercase"
                >Experiencias</span
              >

              <h2
                class="text-4xl md:text-5xl lg:text-6xl font-bold font-heading text-white leading-[1.1]"
              >
                Libera Tu <br />
                <span class="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500"
                  >Potencial Creativo</span
                ><br />
                Con Equipo Profesional
              </h2>

              <p
                class="text-gray-400 text-lg leading-relaxed border-l-2 border-brand-purple/50 pl-6"
              >
                Creemos que el audio de calidad debe ser accesible para todos. Te brindamos las
                herramientas de alta gama que necesitas para que tu talento sea el único límite, sin
                complicaciones ni barreras.
              </p>

              <div class="pt-4">
                <button
                  class="group flex items-center gap-4 text-brand-pink font-bold hover:text-white transition-colors"
                  @click="$router.push('/about')"
                >
                  <span>Más Información</span>
                  <i
                    class="fas fa-arrow-right transform group-hover:translate-x-2 transition-transform"
                  ></i>
                </button>
              </div>
            </div>

            <!-- Image Collage (Right) -->
            <div class="w-full lg:w-2/3 relative">
              <!-- Decor Elements -->
              <div
                class="absolute -top-20 -right-20 w-96 h-96 bg-brand-purple/20 blur-[100px] rounded-full pointer-events-none"
              ></div>

              <div class="grid grid-cols-2 gap-4 md:gap-8 h-[600px]">
                <!-- Col 1 (Stacked) -->
                <div class="space-y-4 md:space-y-8 flex flex-col pt-12">
                  <div class="relative h-1/2 w-full rounded-[40px] overflow-hidden group">
                    <img
                      :src="mockBg1"
                      class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      alt="Experience 1"
                    />
                    <div
                      class="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"
                    ></div>
                  </div>
                  <div class="relative h-1/2 w-full rounded-[40px] overflow-hidden group">
                    <img
                      :src="mockBg2"
                      class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      alt="Experience 2"
                    />
                  </div>
                </div>

                <!-- Col 2 (Tall) -->
                <div class="relative h-full w-full rounded-[40px] overflow-hidden group -mt-12">
                  <img
                    :src="mockBg3"
                    class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    alt="Experience 3"
                  />
                  <GlassCard
                    class="absolute bottom-8 left-8 right-8 !bg-black/60 !backdrop-blur-md !border-white/10 !p-6 !rounded-[20px] translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500"
                  >
                    <p class="text-white font-bold text-lg">Inmersión Total</p>
                    <p class="text-xs text-gray-300">Descubre la nueva colección</p>
                  </GlassCard>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Why Choose Us / Trust Grid -->
      <section class="py-12 lg:py-24 bg-black/20 relative z-10 reveal-on-scroll">
        <div class="container mx-auto px-6 max-w-7xl">
          <div class="text-center mb-16 space-y-4">
            <span class="text-brand-blue font-bold tracking-[0.2em] text-sm uppercase"
              >Por qué elegirnos</span
            >
            <h2 class="text-3xl md:text-5xl font-bold font-heading text-white">
              El Estándar PodStream
            </h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- Card 1: Envíos -->
            <div
              class="group relative bg-[#1c1c1c] border border-white/5 rounded-3xl p-8 hover:bg-brand-blue transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(59,130,246,0.2)] overflow-hidden"
            >
              <div
                class="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-6 text-white text-2xl group-hover:bg-white group-hover:text-brand-blue transition-colors"
              >
                <i class="fas fa-map-location-dot"></i>
              </div>
              <h3 class="text-xl font-bold text-white mb-3">Envíos a Todo Chile</h3>
              <p class="text-gray-400 text-sm leading-relaxed group-hover:text-white/90">
                No importa si estás en Arica o Punta Arenas. Llevamos el equipamiento de primer
                nivel hasta la puerta de tu estudio, rápido y seguro.
              </p>
            </div>

            <!-- Card 2: 24/7 -->
            <div
              class="group relative bg-[#1c1c1c] border border-white/5 rounded-3xl p-8 hover:bg-brand-purple transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(139,92,246,0.2)] overflow-hidden"
            >
              <div
                class="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-6 text-white text-2xl group-hover:bg-white group-hover:text-brand-purple transition-colors"
              >
                <i class="fas fa-store"></i>
              </div>
              <h3 class="text-xl font-bold text-white mb-3">Atención 24/7</h3>
              <p class="text-gray-400 text-sm leading-relaxed group-hover:text-white/90">
                La inspiración no tiene horario de oficina. Nuestra plataforma y equipo de soporte
                están activos siempre que tu creatividad lo requiera.
              </p>
            </div>

            <!-- Card 3: Soporte Experto -->
            <div
              class="group relative bg-[#1c1c1c] border border-white/5 rounded-3xl p-8 hover:bg-brand-pink transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(236,72,153,0.2)] overflow-hidden"
            >
              <div
                class="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-6 text-white text-2xl group-hover:bg-white group-hover:text-brand-pink transition-colors"
              >
                <i class="fas fa-user-astronaut"></i>
              </div>
              <h3 class="text-xl font-bold text-white mb-3">Ingenieros, no Vendedores</h3>
              <p class="text-gray-400 text-sm leading-relaxed group-hover:text-white/90">
                Recibe asesoría técnica real. Nuestro equipo está formado por ingenieros de sonido
                que entienden tu lenguaje y tus necesidades.
              </p>
            </div>

            <!-- Card 4: Originales -->
            <div
              class="group relative bg-[#1c1c1c] border border-white/5 rounded-3xl p-8 hover:bg-emerald-500 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(16,185,129,0.2)] overflow-hidden"
            >
              <div
                class="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-6 text-white text-2xl group-hover:bg-white group-hover:text-emerald-500 transition-colors"
              >
                <i class="fas fa-certificate"></i>
              </div>
              <h3 class="text-xl font-bold text-white mb-3">Productos 100% Originales</h3>
              <p class="text-gray-400 text-sm leading-relaxed group-hover:text-white/90">
                Somos distribuidores autorizados. Tu equipo es nuevo, genuino y viene directo de
                fábrica en su caja sellada.
              </p>
            </div>

            <!-- Card 5: Precios -->
            <div
              class="group relative bg-[#1c1c1c] border border-white/5 rounded-3xl p-8 hover:bg-amber-500 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(245,158,11,0.2)] overflow-hidden"
            >
              <div
                class="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-6 text-white text-2xl group-hover:bg-white group-hover:text-amber-500 transition-colors"
              >
                <i class="fas fa-tag"></i>
              </div>
              <h3 class="text-xl font-bold text-white mb-3">Precios Competitivos</h3>
              <p class="text-gray-400 text-sm leading-relaxed group-hover:text-white/90">
                Accede a equipamiento profesional al mejor precio del mercado. Sin sobrecostos
                ocultos, solo calidad honesta.
              </p>
            </div>

            <!-- Card 6: Financiación -->
            <div
              class="group relative bg-[#1c1c1c] border border-white/5 rounded-3xl p-8 hover:bg-cyan-500 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(6,182,212,0.2)] overflow-hidden"
            >
              <div
                class="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-6 text-white text-2xl group-hover:bg-white group-hover:text-cyan-500 transition-colors"
              >
                <i class="fas fa-credit-card"></i>
              </div>
              <h3 class="text-xl font-bold text-white mb-3">Facilidades de Pago</h3>
              <p class="text-gray-400 text-sm leading-relaxed group-hover:text-white/90">
                Llévate tu setup soñado hoy. Ofrecemos múltiples opciones de financiamiento para que
                el presupuesto no sea un límite.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- New Arrivals Section -->
      <section class="py-12 lg:py-20 border-b border-white/5 reveal-on-scroll">
        <div class="container mx-auto px-6 max-w-7xl">
          <h2
            class="text-3xl md:text-5xl font-bold font-heading text-center mb-16 uppercase tracking-wide"
          >
            Nuevos Ingresos
          </h2>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            <ProductCard
              v-for="product in newArrivals"
              :key="product.id"
              :product="{
                ...product,
                categoryName:
                  product.categoryName || categories.find((c) => c.id === product.categoryId)?.name,
              }"
              @add-to-cart="addToCart"
              @view-details="viewProductDetails"
            />
          </div>

          <div class="text-center mt-12">
            <button
              class="px-10 py-3 rounded-full border border-white/10 hover:bg-white hover:text-black transition-all font-medium text-sm tracking-wide"
              @click="$router.push('/products')"
            >
              Ver Todo
            </button>
          </div>
        </div>
      </section>

      <!-- Best Selling Section (Carousel) -->
      <section class="py-12 lg:py-24 bg-brand-dark/50 relative reveal-on-scroll">
        <div class="container mx-auto px-6 max-w-7xl">
          <h2
            class="text-3xl md:text-5xl font-bold font-heading text-center mb-8 uppercase tracking-wide"
          >
            Lo Más Vendido
          </h2>

          <!-- Category Filter -->
          <div class="flex flex-wrap justify-center gap-4 mb-16">
            <button
              class="px-8 py-3 rounded-full text-sm font-bold tracking-wide transition-all border border-white/10"
              :class="
                activeCategory === 'All'
                  ? 'bg-white text-black'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              "
              @click="activeCategory = 'All'"
            >
              Todo
            </button>
            <button
              v-for="cat in categories"
              :key="cat.id"
              class="px-8 py-3 rounded-full text-sm font-bold tracking-wide transition-all border border-white/10"
              :class="
                activeCategory === cat.name
                  ? 'bg-white text-black'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              "
              @click="activeCategory = cat.name"
            >
              {{ cat.name }}
            </button>
          </div>

          <!-- Carousel -->
          <div class="relative px-4 md:px-12">
            <!-- Nav Buttons -->
            <button
              class="swiper-button-prev-best absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/10 hover:bg-white rounded-full flex items-center justify-center text-white hover:text-black transition-all"
            >
              <i class="fas fa-arrow-left"></i>
            </button>
            <button
              class="swiper-button-next-best absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/10 hover:bg-white rounded-full flex items-center justify-center text-white hover:text-black transition-all"
            >
              <i class="fas fa-arrow-right"></i>
            </button>

            <div ref="bestSellingSwiper" class="swiper w-full !overflow-visible !pt-12 !pb-12">
              <div class="swiper-wrapper">
                <div
                  v-for="product in filteredBestSellers"
                  :key="product.id"
                  class="swiper-slide h-auto"
                >
                  <!-- Stylized Card with 3D Tilt Wrapper -->
                  <div
                    @mousemove="(e) => handleTilt(e, product.id)"
                    @mouseleave="() => resetTilt(product.id)"
                  >
                    <!-- Props adjusted to match ProductCard interface -->
                    <!-- We need to pass the flattened categoryName if checking checks it, inside ProductCard we added that support -->
                    <ProductCard
                      :ref="(el: any) => setCardRef(el, product.id)"
                      :product="{
                        ...product,
                        categoryName:
                          product.categoryName ||
                          categories.find((c) => c.id === product.categoryId)?.name,
                      }"
                      class="transition-all duration-100 ease-out preserve-3d"
                      @add-to-cart="addToCart"
                      @view-details="viewProductDetails"
                    >
                      <template #image-overlay>
                        <div
                          class="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"
                        ></div>
                      </template>
                    </ProductCard>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Browse By Category (Bento) -->
      <section class="py-12 lg:py-20 reveal-on-scroll">
        <div class="container mx-auto px-6 max-w-7xl">
          <div class="bg-[#1e1e1e] rounded-[40px] p-8 md:p-16">
            <h2
              class="text-3xl md:text-5xl font-bold font-heading text-center mb-16 uppercase tracking-wide"
            >
              Explora por
              <span
                class="bg-gradient-to-r from-brand-blue to-brand-purple bg-clip-text text-transparent"
                >Categoría</span
              >
            </h2>

            <!-- Accordion Gallery -->
            <div class="flex flex-col lg:flex-row gap-4 h-[700px] lg:h-[600px] w-full">
              <div
                v-for="(category, index) in categories.slice(0, 5)"
                :key="category.id"
                class="relative rounded-[30px] overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] cursor-pointer group"
                :class="activeAccordionIndex === index ? 'flex-[10]' : 'flex-[2] lg:flex-[1]'"
                @mouseenter="activeAccordionIndex = index"
                @click="$router.push(`/products?category=${category.id}`)"
              >
                <!-- Background -->
                <img
                  :src="category.image"
                  class="absolute inset-0 w-full h-full object-cover transition-transform duration-1000"
                  :class="
                    activeAccordionIndex === index ? 'scale-110' : 'scale-100 grayscale opacity-40'
                  "
                  alt="Category"
                />
                <div
                  class="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent transition-opacity duration-500"
                  :class="activeAccordionIndex === index ? 'opacity-80' : 'opacity-90'"
                ></div>

                <!-- Content -->
                <div class="absolute inset-0 p-8 flex flex-col justify-end">
                  <!-- Vertical Label (Collapsed) -->
                  <div
                    class="absolute bottom-8 left-1/2 -translate-x-1/2 transition-all duration-500 origin-bottom"
                    :class="
                      activeAccordionIndex === index
                        ? 'opacity-0 translate-y-10 scale-0'
                        : 'opacity-100'
                    "
                  >
                    <span
                      class="text-white/50 font-bold uppercase tracking-widest text-sm whitespace-nowrap [writing-mode:vertical-rl] rotate-180"
                    >
                      {{ category.name }}
                    </span>
                  </div>

                  <!-- Expanded Content -->
                  <div
                    class="transition-all duration-500 delay-100"
                    :class="
                      activeAccordionIndex === index
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-10 absolute bottom-8 left-8'
                    "
                  >
                    <h3
                      class="text-3xl md:text-4xl font-bold font-heading text-white mb-2 leading-none"
                    >
                      {{ category.name }}
                    </h3>
                    <div class="w-full h-1 bg-brand-pink/50 rounded-full mb-4 max-w-[50px]"></div>
                    <p
                      v-if="activeAccordionIndex === index"
                      class="text-gray-300 text-sm line-clamp-2 md:line-clamp-3 max-w-md opacity-0 animate__animated animate__fadeInUp"
                    >
                      Explora lo mejor en {{ category.name }}. Calidad de estudio garantizada.
                    </p>

                    <button
                      class="mt-6 px-6 py-2 rounded-full border border-white/20 text-white text-xs font-bold uppercase tracking-wider hover:bg-white hover:text-black transition-all"
                    >
                      Ver Productos
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- About & Contact Section -->
      <section class="py-12 lg:py-24 relative z-10 overflow-hidden reveal-on-scroll">
        <div class="container mx-auto px-6 max-w-7xl space-y-16 lg:space-y-32">
          <!-- About Us (Text Left, Image Right) -->
          <div class="flex flex-col lg:flex-row items-center gap-16">
            <div class="w-full lg:w-1/2 space-y-8">
              <div>
                <span
                  class="text-brand-purple font-bold tracking-[0.2em] text-sm uppercase mb-2 block"
                  >Sobre Nosotros</span
                >
                <h2 class="text-3xl md:text-5xl font-bold font-heading text-white leading-tight">
                  Somos los <br />
                  <span
                    class="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-purple"
                    >Expertos en Audio</span
                  ><br />
                  que estabas buscando
                </h2>
              </div>

              <p class="text-gray-400 text-lg leading-relaxed">
                Nacimos con una misión: democratizar el acceso al audio profesional. No somos solo
                una tienda, somos un colectivo de productores, ingenieros y creadores apasionados
                por el sonido de alta fidelidad.
              </p>

              <button
                class="px-8 py-4 rounded-full bg-white text-black font-bold uppercase tracking-wider hover:bg-brand-blue hover:text-white transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)]"
                @click="$router.push('/about')"
              >
                Conoce nuestra historia
              </button>
            </div>

            <div class="w-full lg:w-1/2 relative group">
              <div
                class="absolute inset-0 bg-brand-purple/20 blur-[80px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"
              ></div>
              <div
                class="relative rounded-[40px] overflow-hidden transform group-hover:scale-[1.02] transition-transform duration-500"
              >
                <img :src="mockBg1" class="w-full h-[500px] object-cover" alt="PodStream Team" />
                <div
                  class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"
                ></div>
              </div>
            </div>
          </div>

          <!-- Contact Us (Image Left, Text Right) -->
          <div class="flex flex-col lg:flex-row-reverse items-center gap-16">
            <div class="w-full lg:w-1/2 space-y-8 text-right">
              <div>
                <span
                  class="text-brand-pink font-bold tracking-[0.2em] text-sm uppercase mb-2 block"
                  >Contacto 24/7</span
                >
                <h2 class="text-3xl md:text-5xl font-bold font-heading text-white leading-tight">
                  ¿Tienes dudas? <br />
                  <span
                    class="text-transparent bg-clip-text bg-gradient-to-l from-brand-pink to-brand-purple"
                    >Hablemos Ahora</span
                  >
                </h2>
              </div>

              <p class="text-gray-400 text-lg leading-relaxed ml-auto max-w-xl">
                Ya sea para armar tu primer home studio, cotizar un proyecto grande o resolver un
                problema técnico. Nuestro equipo está a un clic de distancia.
              </p>

              <div class="flex flex-wrap justify-end gap-4">
                <button
                  class="px-8 py-4 rounded-full border border-white/20 text-white font-bold uppercase tracking-wider hover:bg-white hover:text-black transition-all"
                  @click="$router.push('/contact')"
                >
                  Soporte
                </button>
                <button
                  class="px-8 py-4 rounded-full bg-brand-pink text-white font-bold uppercase tracking-wider hover:bg-brand-purple transition-all shadow-[0_0_20px_rgba(236,72,153,0.4)]"
                  @click="$router.push('/contact')"
                >
                  Contactar Ventas
                </button>
              </div>
            </div>

            <div class="w-full lg:w-1/2 relative group">
              <div
                class="absolute inset-0 bg-brand-pink/20 blur-[80px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"
              ></div>
              <div
                class="relative rounded-[40px] overflow-hidden transform group-hover:scale-[1.02] transition-transform duration-500"
              >
                <img :src="mockBg3" class="w-full h-[500px] object-cover" alt="PodStream Support" />
                <!-- Floating Badge -->
                <GlassCard
                  class="absolute top-8 left-8 !bg-black/60 !backdrop-blur-md !border-white/10 !p-4 !rounded-2xl flex items-center gap-4 animate__animated animate__bounce animate__infinite animate__slow"
                >
                  <div
                    class="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white text-xl"
                  >
                    <i class="fas fa-headset"></i>
                  </div>
                  <div>
                    <p class="text-white font-bold text-sm">Online</p>
                    <p class="text-green-400 text-xs">Respuesta inmediata</p>
                  </div>
                </GlassCard>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Testimonials Section -->
      <section class="py-12 lg:py-24 relative overflow-hidden reveal-on-scroll">
        <div class="container mx-auto px-6 max-w-7xl relative z-10 w-full">
          <div class="text-center mb-16 space-y-4">
            <h2 class="text-sm font-bold text-brand-blue tracking-[0.2em] uppercase mb-2">
              Testimonios
            </h2>
            <h3 class="text-4xl md:text-5xl font-bold font-heading text-white">
              La Comunidad Habla
            </h3>
          </div>

          <!-- Swiper Container with Navigation Buttons Outside -->
          <div class="relative px-12">
            <button
              class="swiper-button-prev-test absolute left-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/10 hover:bg-white rounded-full flex items-center justify-center text-white hover:text-black transition-all"
            >
              <i class="fas fa-arrow-left"></i>
            </button>
            <button
              class="swiper-button-next-test absolute right-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/10 hover:bg-white rounded-full flex items-center justify-center text-white hover:text-black transition-all"
            >
              <i class="fas fa-arrow-right"></i>
            </button>

            <div ref="testimonialSwiper" class="swiper w-full !overflow-visible !pb-12">
              <div class="swiper-wrapper">
                <div v-for="review in testimonials" :key="review.id" class="swiper-slide h-auto">
                  <!-- Testimonial Card -->
                  <div class="relative h-[450px] rounded-[30px] overflow-hidden group">
                    <!-- Background Image -->
                    <img
                      :src="review.bgImage"
                      class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                      alt="Studio Setup"
                    />
                    <div
                      class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"
                    ></div>

                    <!-- Floating Content Card -->
                    <div class="absolute bottom-3 left-6 right-6">
                      <GlassCard
                        class="relative !bg-black/60 !backdrop-blur-xl !border-white/10 !p-6 !pt-24 text-center !rounded-[20px]"
                      >
                        <!-- Avatar (Floating Top Center) -->
                        <div
                          class="absolute -top-20 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full border-4 border-brand-dark overflow-hidden shadow-lg"
                        >
                          <img
                            :src="review.avatar"
                            class="w-full h-full object-cover"
                            :alt="review.name"
                          />
                        </div>

                        <!-- Content -->
                        <h4 class="text-xl font-bold text-white mb-1">{{ review.name }}</h4>
                        <p class="text-xs text-brand-blue uppercase font-bold tracking-wider mb-4">
                          {{ review.role }}
                        </p>

                        <p class="text-gray-300 text-sm italic leading-relaxed mb-4">
                          "{{ review.quote }}"
                        </p>

                        <!-- Stars -->
                        <div class="flex justify-center gap-1 text-yellow-400 text-xs">
                          <i
                            v-for="n in 5"
                            :key="n"
                            class="fas fa-star"
                            :class="{ 'opacity-30': n > review.rating }"
                          ></i>
                        </div>
                      </GlassCard>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'
import type { Product, Category } from '@/types'
import { getFullImageUrl } from '@/utils/imageHelper'
import Swiper from 'swiper'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'animate.css'

// Components
import GlassCard from '@/components/ui/GlassCard.vue'
import ProductCard from '@/components/shop/ProductCard.vue'
import HeroCarousel3D from '@/components/public/HeroCarousel3D.vue'

// Assets - Mock Images
// In real app, import these or use URLs
const mockBg1 =
  'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=2070&auto=format&fit=crop'
const mockBg2 =
  'https://images.unsplash.com/photo-1598653222000-6b7b7a552625?q=80&w=2070&auto=format&fit=crop'
const mockBg3 =
  'https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=1000&auto=format&fit=crop'
const vectorBg = new URL('@/assets/image/vector-bg.jpg', import.meta.url).href
const mockAvatar1 = 'https://i.pravatar.cc/150?img=11'
const mockAvatar2 = 'https://i.pravatar.cc/150?img=32' // corrected
const mockAvatar3 = 'https://i.pravatar.cc/150?img=5'

const router = useRouter()

// UI State
const testimonialSwiper = ref<HTMLElement | null>(null)
const bestSellingSwiper = ref<HTMLElement | null>(null)
const activeCategory = ref('All')
const activeAccordionIndex = ref(0)

// 3D Tilt State - Optimized to avoid Vue reactivity overhead
const cardRefs = ref<Record<number, HTMLElement>>({})
const imageRefs = ref<Record<number, HTMLElement>>({})

const setCardRef = (el: unknown, id: number) => {
  if (el && typeof el === 'object' && '$el' in el) {
    cardRefs.value[id] = (el as { $el: HTMLElement }).$el
  }
}

const handleTilt = (e: MouseEvent, id: number) => {
  const card = cardRefs.value[id]
  const image = imageRefs.value[id]

  if (!card || !image) return

  // Use requestAnimationFrame for performance if needed, but direct style update is often faster than Vue patch
  const rect = card.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  const centerX = rect.width / 2
  const centerY = rect.height / 2

  const LIMIT = 15
  const rotateX = ((y - centerY) / centerY) * -LIMIT
  const rotateY = ((x - centerX) / centerX) * LIMIT

  // Direct DOM manipulation
  card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`
  card.style.transition = 'none'

  image.style.transform = `translateX(${rotateY * 2}px) translateY(${rotateX * 2}px) scale(1.1) translateZ(50px)`
  image.style.transition = 'none'
}

const resetTilt = (id: number) => {
  const card = cardRefs.value[id]
  const image = imageRefs.value[id]

  if (card) {
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`
    card.style.transition = 'all 0.5s cubic-bezier(0.23, 1, 0.32, 1)'
  }
  if (image) {
    image.style.transform = `translateX(0) translateY(0) scale(1) translateZ(0)`
    image.style.transition = 'all 0.5s cubic-bezier(0.23, 1, 0.32, 1)'
  }
}

// Data
const products = ref<Product[]>([])
const categories = ref<Category[]>([])

const testimonials = ref([
  {
    id: 1,
    name: 'Carlos Ruiz',
    role: 'Productor Musical',
    quote:
      'PodStream cambió mi forma de trabajar. El equipamiento llegó impecable y mi estudio ahora suena (y se ve) nivel dios.',
    rating: 5,
    bgImage: mockBg1,
    avatar: mockAvatar1,
  },
  {
    id: 2,
    name: 'Sofia Mendez',
    role: 'Streamer Twitch',
    quote:
      'La calidad del micrófono es brutal. Mis seguidores notaron el cambio de audio al instante, se siente súper pro.',
    rating: 5,
    bgImage: mockBg2,
    avatar: mockAvatar2,
  },
  {
    id: 3,
    name: 'Javier Torrez',
    role: 'Podcaster',
    quote:
      'Atención de primera y los productos son 100% originales. Comprar aquí fue la mejor inversión para mi podcast.',
    rating: 4,
    bgImage: mockBg3,
    avatar: mockAvatar3,
  },
  {
    id: 4, // Duplicate for slider length
    name: 'Ana Belen',
    role: 'Creadora de Contenido',
    quote:
      'Encontré todo para mi home studio en un solo lugar. El envío a región fue rapidísimo y todo llegó seguro.',
    rating: 5,
    bgImage: mockBg1,
    avatar: mockAvatar1, // Reusing
  },
])

// Computed for sections
const newArrivals = computed(() => products.value.slice(0, 4))

const filteredBestSellers = computed(() => {
  if (activeCategory.value === 'All') {
    return products.value.slice(0, 8)
  }
  // Find category object
  const cat = categories.value.find((c) => c.name === activeCategory.value)
  if (!cat) return []

  // Filter by category ID or Name (Fallback for backend variations)
  return products.value
    .filter((p) => {
      const pData = p as {
        category?: { id?: number; name?: string }
        categoryId?: number
        categoryName?: string
      }
      const pCatId = pData.category?.id || pData.categoryId
      // If we have IDs to compare
      if (pCatId && cat.id) return pCatId === cat.id

      // Fallback: Compare names (Backend seems to return categoryName)
      const pCatName = pData.category?.name || pData.categoryName
      return pCatName === cat.name
    })
    .slice(0, 8)
})

// Methods
const fetchFeaturedProducts = async () => {
  try {
    const response = await api.get('/products', { params: { size: 50 } }) // Fetch more to allow filtering
    const responseData = response.data || response
    const rawData = Array.isArray(responseData) ? responseData : responseData.content || []

    // Fetch enough products for both sections
    products.value = rawData.map((p: unknown) => {
      const prod = p as { image?: string; images?: string[]; photos?: string[] }
      return {
        ...(p as Record<string, unknown>),
        image: getFullImageUrl(
          prod.image ||
            (prod.images && prod.images.length > 0 ? prod.images[0] : null) ||
            (prod.photos && prod.photos.length > 0 ? prod.photos[0] : null),
        ),
      }
    })
  } catch (error) {
    console.error('Error fetching featured products:', error)
  }
}

const fetchCategories = async () => {
  try {
    const response = await api.get('/categories')
    const responseData = response.data || response
    const rawData = Array.isArray(responseData) ? responseData : responseData.content || []

    // Sort logic? Maybe random or by ID.
    categories.value = rawData.map((c: unknown) => {
      const cat = c as { image?: string }
      return {
        ...(c as Record<string, unknown>),
        image: getFullImageUrl(cat.image),
      }
    })
  } catch (error) {
    console.error('Error fetching categories:', error)
  }
}

const addToCart = (product: unknown) => {
  console.log('Adding to cart', product)
  // Use store or emit event
}

const viewProductDetails = (product: unknown) => {
  const prod = product as { id?: number }
  router.push(`/products/${prod.id}`)
}

// Lifecycle
onMounted(async () => {
  await Promise.all([fetchFeaturedProducts(), fetchCategories()])

  if (testimonialSwiper.value) {
    new Swiper(testimonialSwiper.value, {
      modules: [Navigation, Pagination, Autoplay],
      slidesPerView: 1, // Mobile default
      spaceBetween: 30,
      loop: true,
      observer: true, // Fix for dynamic content updates
      observeParents: true,
      autoplay: { delay: 5000 },
      navigation: {
        nextEl: '.swiper-button-next-test',
        prevEl: '.swiper-button-prev-test',
      },
      breakpoints: {
        640: { slidesPerView: 2, spaceBetween: 20 },
        1024: { slidesPerView: 3, spaceBetween: 30 },
      },
    })
  }

  if (bestSellingSwiper.value) {
    new Swiper(bestSellingSwiper.value, {
      modules: [Navigation, Pagination],
      slidesPerView: 1,
      spaceBetween: 24,
      observer: true,
      observeParents: true,
      navigation: {
        nextEl: '.swiper-button-next-best',
        prevEl: '.swiper-button-prev-best',
      },
      breakpoints: {
        640: { slidesPerView: 2 },
        1024: { slidesPerView: 4 },
      },
    })
  }

  // Scroll Reveal Observer
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-active')
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.15, rootMargin: '-50px' },
  )

  document.querySelectorAll('.reveal-on-scroll').forEach((el) => {
    observer.observe(el)
  })
})
</script>

<style scoped>
/* Ensure smooth gradients */
.bg-gradient-to-r {
  background-size: 200% 200%;
}

.reveal-on-scroll {
  opacity: 0;
  transform: translateY(50px) scale(0.95);
  transition: all 1.5s cubic-bezier(0.2, 0.8, 0.2, 1);
  will-change: transform, opacity;
}

.reveal-active {
  opacity: 1;
  transform: translateY(0);
}
</style>
